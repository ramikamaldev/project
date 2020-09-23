/**
 * create_and_return_promise - this function creates a promise with the passed in promiseFunction, easing the binding with the 'then' object.
 */
export async function create_and_return_promise(promise_function) {
    return new Promise(promise_function);
}

/**
 * check_if_collection_exists_and_execute - This function checks if the collection exists in the database, if not it will execute the execution_function_coll_not_exists function, 
 * if so, it will execute the execution_function_if_coll_exist. This is to handle the corner-case of a collection not existing, which would cause a system crash.
 */
export function check_if_collection_exists_and_execute(resolve, reject, collection_model, execution_function_if_coll_exists, data, execution_function_coll_not_exists?) {
    collection_model.db.db.listCollections().toArray(function (err, names) {
        if (names.length === 0) {
            execution_function_coll_not_exists(resolve, reject, data)
        }
        else {
            for (let search_index = 0; search_index < names.length; search_index++) {
                if(names[search_index]["name"] === collection_model.collection.collectionName) {
                    return execution_function_if_coll_exists(resolve, reject, data);
                }
                else if (search_index === names.length - 1) {
                    execution_function_coll_not_exists(resolve, reject, data) || console.log("Collection does not exist: ", collection_model.collection.collectionName);
                }
                    
            }
        }
    });
}