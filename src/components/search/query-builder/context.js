import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useOntology } from "../../ontology";
import { useMemo } from "react";
import { arrayToTree } from "../../../util/array-to-tree";
import produce from "immer";
import { useCallback } from "react";

const QueryBuilderContext = createContext({});
export const useQueryBuilder = () => useContext(QueryBuilderContext);

export const QueryBuilderProvider = ({ children }) => {
  const ontology = useOntology();
  const [query, setQuery] = useState([]);
  const [outerOperator, setOuterOperator] = useState("AND");
  const [innerOperator, setInnerOperator] = useState("OR");

  /**
   * An array of all the top level terms in the current query
   */
  const roots = useMemo(() => query.map((roots) => roots.name), [query]);

  const clearQuery = () => setQuery([]);

  const containsRoot = (termId) => query.map((root) => root.name).includes(termId);

  /**
   * Adds a term and its entire subtree, setting the root `termId` to a `positive`
   * state, and all children to `neutral`
   * @param {string} termId key to be added to the query
   */
  const addTerm = (termId) => {
    // check if term already exists in query
    if (query.some((root) => root.name === termId)) return;

    // get flat list of terms with parentIds.
    // on the termId's object, set the parentId to null so `arrayToTree`
    // doesn't try to find the parent that doesn't exist
    const descendants = [
      {
        ...ontology.find(termId),
        parentId: null,
      },
      ...ontology.descendantsOf(termId, { strict: true }),
    ];

    // helper recursive function to convert the output of `arrayToTree` and
    // set a default `state` key for each term
    const reduceTree = (node) => {
      return {
        name: node.id,
        state: "positive",
        labels: node.labels,
        path: node.path,
        children: node.children.map(reduceTree),
      };
    };
    const tree = reduceTree(arrayToTree(descendants)[0]);

    setQuery((query) => [...query, tree]);
  };

  /**
   * Removes a term and all of its children
   * @param {string} termId term to be removed from the query
   */
  const removeTerm = (termId) => {
    setQuery((query) => query.filter((root) => root.name !== termId));
  };

  /**
   * Cycles a term's state between `neutral`, `positive`, and `negative`
   * @param {*} path an array of term ids representing the path from
   * the root to the term to be toggled
   */
  const toggleTermState = (path) => {
    const states = ["neutral", "positive"];

    // use Immer to performantly update necessary section of tree
    const nextQuery = produce(query, (draft) => {
      let currentTerm;
      let currentChildren = draft;
      for (const term of path) {
        currentTerm = currentChildren.find((child) => child.name === term);
        if (!currentTerm) {
          console.warn(
            "toggleTermState: The path provided is not present in the current query builder state"
          );
          return;
        }
        currentChildren = currentTerm.children;
      }

      // get the next state string in the list
      const currentTermState = currentTerm.state;
      const currentStateIndex = states.indexOf(currentTermState);
      const nextStateIndex = (currentStateIndex + 1) % states.length;
      const nextState = states[nextStateIndex];

      // set state on all subtree children (and term that was clicked on)
      const traverse = (term) => {
        term.state = nextState;
        term.children.map(traverse);
      }
      traverse(currentTerm);
    });

    setQuery(nextQuery);
  };

  /**
   * Event handler which sets the `inner` or `outer` operator to `event.target.value`
   * @param {"inner" | "outer"} operator which operator to target
   */
  const handleChangeOperator = useCallback((operator) => {
    if (operator === "inner") {
      return (event) => setInnerOperator(event.target.value);
    }
    if (operator === "outer") {
      return (event) => setOuterOperator(event.target.value);
    }
  }, []);

  /**
   * Query object to be displayed in UI and sent in body of NeuroBridge query
   */
  const nbQueryObject = useMemo(() => {
    let outerObj = { [outerOperator]: [] };

    query.forEach((root) => {
      // make a list for all of the terms with state !== neutral in this root's subtree
      const subtreeList = [];

      // first check if the root itself has a state
      if (root.state === "positive") {
        subtreeList.push(root.name);
      }

      // DFS traverse the tree and add any terms with state !== neutral to the subtreeList
      const traverse = (node) => {
        for (const child of node.children) {
          if (child.state === "positive") {
            subtreeList.push(child.name);
          }
          traverse(child);
        }
      };
      traverse(root);

      // spread the objects found in this root's subtree into the innerOperator (OR)
      if(subtreeList.length > 0) outerObj[outerOperator].push({ [innerOperator]: [...subtreeList] });
    }, [query]);

    // if there is only one root, remove the outerOperator (AND)
    if (query.length === 1) {
      outerObj = outerObj[outerOperator][0];
    }

    return outerObj;
  }, [query, innerOperator, outerOperator]);

  /**
   * Array of all currently selected (positive) terms in the query builder
   */
  const selectedTerms = useMemo(() => {
    const terms = new Set();

    const traverse = (node) => {
      if (node.state === 'positive') terms.add(node.labels[0]);
      node.children.map(traverse);
    }
    query.map(traverse);

    return Array.from(terms);
  }, [query]);

  return (
    <QueryBuilderContext.Provider
      value={{
        query,
        nbQueryObject,
        selectedTerms,
        roots,
        containsRoot,
        addTerm,
        removeTerm,
        toggleTermState,
        clearQuery,
        handleChangeOperator,
        innerOperator,
        outerOperator,
      }}
    >
      {children}
    </QueryBuilderContext.Provider>
  );
};

QueryBuilderProvider.propTypes = {
  children: PropTypes.node,
};
