/**
 * Converts an array of items with ids and parent ids to a nested tree. 
 * 
 * Based on https://github.com/philipstanislaus/performant-array-to-tree/, with an addition to add a path
 * array to each node, displaying the path taken from the root node
 * 
 * @param {any[]} items 
 * @returns Object representing the tree, nodes contain original data plus the path from the root node
 */
export const arrayToTree = (items) => {
  // the resulting unflattened tree
  const rootItems = [];

  // stores all already processed items with their ids as key so we can easily look them up
  const lookup = {};

  // idea of this loop:
  // whenever an item has a parent, but the parent is not yet in the lookup object, we store a preliminary parent
  // in the lookup object and fill it with the data of the parent later
  // if an item has no parentId, add it as a root element to rootItems
  for (const item of items) {
    const { id: itemId, parentId } = item;

    // look whether item already exists in the lookup table
    if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
      // item is not yet there, so add a preliminary item (its data will be added later)
      lookup[itemId] = { children: [] };
    }

    // add the current item's data to the item in the lookup table
    lookup[itemId] = {
      ...item,
      children: lookup[itemId].children,
    };

    const treeItem = lookup[itemId];

    if (parentId === null || parentId === undefined) {
      // is a root item
      rootItems.push(treeItem);
    } else {
      // has a parent

      // look whether the parent already exists in the lookup table
      if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
        // parent is not yet there, so add a preliminary parent (its data will be added later)
        lookup[parentId] = { children: [] };
      }

      // add the current item to the parent
      lookup[parentId].children.push({
        ...treeItem,
      });
    }
  }

  // recursively add path to each node
  const buildPath = (node, path = []) => {
    node.path = [...path, node.id];
    for (const child of node.children) {
      buildPath(child, node.path);
    }
  }
  for (const rootNode of rootItems) {
    buildPath(rootNode);
  }

  return rootItems;
};
