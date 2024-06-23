type TreeSrcType = { id: number; title: string; parent?: string }
export type TreeNodeType<T> = {
  id: number
  key: string
  title: string
  children?: TreeNodeType<T>[]
  parent?: string
  show?: boolean
  fake?: boolean
} & T
export interface MyTreeInfo<EntityT> {
  trees: TreeNodeType<EntityT>[]
  datalist: TreeNodeType<EntityT>[]
  datamap: Map<string, TreeNodeType<EntityT>>
}

//获取树
export const GetCommonTree = <T extends TreeSrcType>(src_items: T[]): MyTreeInfo<T> => {
  let tree_nodes: TreeNodeType<T>[] = []
  let datalist: TreeNodeType<T>[] = []
  let datamap = new Map<string, TreeNodeType<T>>()
  const menu_map = new Map<string, T>()
  if (src_items.length > 0) {
    src_items.forEach((item) => {
      menu_map.set(item.id.toString(), item)
    })
    const addTreeNode = (item: T): TreeNodeType<T> => {
      // console.log("add tree node");
      const node_item = Object.assign({ key: item.id.toString() }, { ...item }) as TreeNodeType<T>
      if (datamap.has(node_item.key.toString())) return datamap.get(node_item.key.toString())!
      if (item.parent && item.parent != '0') {
        const parent_node = addTreeNode(menu_map.get(item.parent.toString())!)
        if (parent_node.children) {
          parent_node.children.push(node_item)
        } else {
          parent_node.children = [node_item]
        }
      } else {
        tree_nodes.push(node_item)
      }
      datamap.set(node_item.key.toString(), node_item)
      datalist.push(node_item)
      return node_item
    }
    src_items.forEach((item) => {
      addTreeNode(item)
    })
  }
  return { trees: tree_nodes, datalist, datamap }
}
