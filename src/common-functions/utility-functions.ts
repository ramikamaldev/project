/**
 * Creates a promise with the passed in promiseFunction, eases the binding with the 'then' object.
 */
export async function create_and_return_promise(promise_function) {
    return new Promise(promise_function);
}

export function check_if_collection_exists_and_execute(resolve, reject, collection_model, execution_function_if_coll_exists, data, execution_function_coll_not_exists?) {
    collection_model.db.db.listCollections().toArray(function (err, names) {
        console.log("Collection Names");
        if (names.length === 0) {
            execution_function_coll_not_exists(resolve, reject, data)
        }
        else {
            for (let search_index = 0; search_index < names.length; search_index++) {
                names[search_index]["name"] === collection_model.collection.collection_name ?
                    execution_function_if_coll_exists(resolve, reject, data) :
                    execution_function_coll_not_exists(resolve, reject, data) || console.log("Collection does not exist");
            }
        }

    })
}