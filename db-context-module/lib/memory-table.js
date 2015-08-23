
var util = require('util');
var base = require('./table-prototype');
base.extendTo(DataTable);

/**
 * Creates a memory datatable binded to an object model.
 * This API is compliant with 'error-first' callback style
 * @param {string} name: Datatable name
 * @param {object} model: Constructor function bind the items to a validation function.
 * */
function DataTable(name, model) {
    this.Name=name
    var innerTable = [];
    var itemType = model;
    DataTable.super_.call(this);
    
    /**
     * Validates if the item is the same type that the model on the table
     * Calls the error callback if the validation fails
     * @param {object} item: Item to validate
     * @param {function} doneCb(err): Callback in the case of an error
     * @return {boolean}: True if the validation succeded
     * */
    function validateItem(item, doneCb) {
        if (!(item instanceof itemType)) {
            var err = new TypeError("Item to add does not have the same type than the remaining items on the table.");
            err.userError=true;
            doneCb(err);
            return false;
        }   
        return true;
    }

    /**
     * Adds one item to the table.
     * @param {object} item: Item to be inserted.
     * @param {function} doneCb(err, insCount): Callback with the error and the number of inserted item. 
     * */
    this.add = function (item, doneCb) {
        if (!validateItem(item, doneCb))
            return;

        this.getById(item.Id, function (err, objArray) {
            if(err)
                return doneCb(err);

            if (objArray.length > 0){
                err = new Error(util.format("Item with id [%s] already exists.",item.Id));
                err.userError=true;
                return doneCb(err);
            }
        
            innerTable.push(item);
        
            doneCb(null,1);
        });
        
    }

    /**
     * Gets all the items in the table.
     * @param {function} doneCb(err, itemArray): Callback with the error and the array of items in the table.
     * */
    this.getAll = function (doneCb) {
        var ret = [];
        for (var i = 0; i < innerTable.length; i++)
            ret.push(Object.create(innerTable[i]));
        doneCb(null,ret);
    }

    /**
     * Gets an the items in the table by it's ID.
     * @param {object} id: ID to search.
     * @param {function} doneCb(err, itemArray): Callback with the error and the array of items in the table with that ID. 
     * */
    this.getById = function (id, doneCb) {
        for (var i = 0; i < innerTable.length; i++)
            if (id == innerTable[i].Id)
                return doneCb(null,[Object.create(innerTable[i])] );

        return doneCb(null,[]);
    }

    /**
     * Gets an the items in the table by a predicate function.
     * @param {function} predicate(item): Predicate function to be used
     * @param {function} doneCb(err, itemArray): Callback with the error and the array of items in the table that match the function. 
     * */
    this.get = function (predicate, doneCb) {
        var ret = [];
        var func = predicate;
        for (var i = 0; i < innerTable.length; i++)
            if (func(innerTable[i]))
                ret.push(Object.create(innerTable[i]));
        doneCb(null,ret);
    }
    
    /**
     * @param {function} predicate(item): Predicate function to be used
     * @param {int} startRow: Zero based row number for start collecting.
     * @param {int} maxRows: Max number of objects to return
     * @param {string} sortColumn: Field for sort
     * @param {boolean} descending: True if descending order
     * @param {function} doneCb(err, objArray): Function called with error and the array of items.
     */
    this.getTop = function (predicate, startRow, maxRows, sortColumn, descending, doneCb) {
        var ordered;
        var reverse = descending ? -1:1;
        ordered = innerTable.sort(function (a, b){
            if(a[sortColumn]<b[sortColumn])
                return -1 * reverse;
            if (a[sortColumn] > b[sortColumn])
                return 1 * reverse;
                
            return 0;
        });

        var ret = [];
        var func = predicate;
        for (var i = 0; i < ordered.length; i++)
            if (i >= startRow)
                if (func(ordered[i]) && maxRows-- > 0) {
                    ret.push(Object.create(ordered[i]));
                    if (maxRows == 0)
                        break;
                }
        doneCb(null,ret);
    }

    /**
     * Counts the items in the table by a predicate function.
     * @param {function} predicate(item): Predicate function to be used
     * @param {function} doneCb(err, count): Callback with the error and the number items in the table that match the function. 
     * */
    this.count = function (predicate, doneCb) {
        var ret = 0;
        var func = predicate;
        for (var i = 0; i < innerTable.length; i++)
            if (func(innerTable[i]))
                ret++;
        doneCb(null,ret);
    }

    /**
     * Updates the items in the table with the values in the item. Will be updated all the items that match item.Id property.
     * @param {object} item: Item with the values for the update.
     * @param {function} doneCb(err, updCount): Callback with the error and the number items updated.
     * */
    this.updateById = function (item, doneCb) {
        if (item.Id == undefined) {
            var err = new Error("Item must have an Id for the update process.");
            err.userError=true;
            return doneCb(err);
        }

        if (!validateItem(item,doneCb))
            return;

        var cnt = 0;
        for (var i = 0; i < innerTable.length; i++)
            if (innerTable[i].Id == item.Id) {
                innerTable[i] = Object.create(item);
                cnt++;
            }

        doneCb(null,cnt);

    }

    /**
     * Deletes all the items in the table with the specified id.
     * @param {object} id: ID to be used in the delete process.
     * @param {function} doneCb(err, delCount): Callback with the error and the number items deleted.
     * */
    this.deleteById = function (id, doneCb) {
        if (id == undefined) {
            var err = new Error("An Id is required for the delete process.");
            err.userError=true;
            return doneCb(err);
        }
        
        var cnt = 0;

        for (var i = 0; i < innerTable.length; i++)
            if (innerTable[i].Id == id) {
                innerTable.splice(i, 1);
                cnt++;
            }

        doneCb(null,cnt);

    }

    /**
     * Returns the first element that matches the predicate.
     * @param {function} predicate(item): Predicate function to be used
     * @param {function} doneCb(err, itemFound): Callback with the error and the number items deleted.
     * */
    this.find = function(predicate, doneCb){
        for (var i = 0; i < innerTable.length; i++){
            if(predicate(innerTable[i]))
                return doneCb(null, innerTable[i]);
        }
        return doneCb(null, null);
    }
}

module.exports = DataTable;