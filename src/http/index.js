/**
 * Created by bstojchevski on 5/23/2017.
 */
import { generate as id } from "shortid";

const asyncAwaitTime = 2500;
export const get = (url, callback) => {
    setTimeout(() => {
        callback(id());
    }, asyncAwaitTime);
};