import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentStateAnnotation } from "./state.js";

import { scraperNode }   from "../nodes/scraperNode.js";
import { parserNode }    from "../nodes/parserNode.js";
import { ragNode }       from "../nodes/ragNode.js";
import { generatorNode } from "../nodes/generatorNode.js";

export function createGraph() {
  const graph = new StateGraph(AgentStateAnnotation)
    .addNode("scraper",   scraperNode)
    .addNode("parser",    parserNode)
    .addNode("rag",       ragNode)
    .addNode("generator", generatorNode)
    .addEdge(START,       "scraper")
    .addEdge("scraper",   "parser")
    .addEdge("parser",    "rag")
    .addEdge("rag",       "generator")
    .addEdge("generator", END);

  return graph.compile();
}