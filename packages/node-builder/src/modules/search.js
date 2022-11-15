import lunr from "lunr"
import { createNode } from "./nodes"
// import NodeTypes from "./nodeTypes"

const NodeTypes = {}
const docs = prepDocumentsForSearch(NodeTypes, createNode)

const searchIndex = lunr(function () {
    this.ref("id")
    this.field("name")
    this.field("description")
    this.field("_mainCategory", { boost: 10 })
    this.field("_categories")

    this.metadataWhitelist = ['position']

    Object.values(docs).forEach(doc => this.add(doc))
})


function prepDocumentsForSearch(collection, _create) {
    return Object.fromEntries(
        Object.values(collection).map(item => [
            item.id,
            {
                ...item,
                _create,
                _mainCategory: item.categories?.[0] ?? "",
                _categories: item.categories?.join(" "),
            }
        ])
    )
}


export default {
    search: query => searchIndex.search(query.trim() + "*")
        .map(result => ({
            ...result,
            doc: docs[result.ref]
        }))
}