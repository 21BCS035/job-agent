import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentStateAnnotation } from "./state.js";

import { scraperNode }   from "../nodes/scraperNode.js";
import { parserNode }    from "../nodes/parserNode.js";
import { ragNode }       from "../nodes/ragNode.js";
import { generatorNode } from "../nodes/generatorNode.js";
import { decisionNode } from "../nodes/decisionNode.js";
import { validationNode } from "../nodes/validationNode.js";

export function createGraph() {
  const graph = new StateGraph(AgentStateAnnotation)
    .addNode("decision", decisionNode)
    .addNode("scraper",   scraperNode)
    .addNode("parser",    parserNode)
    .addNode("rag",       ragNode)
    .addNode("generator", generatorNode)
    .addNode("validation", validationNode)
    .addEdge(START, "decision")
    .addConditionalEdges("decision", (state) => {
    if (state.shouldScrape) return "scraper";
    return "parser";
  })
    .addEdge("scraper",   "validation")
    .addEdge("validation", "parser")
    .addEdge("parser",    "rag")
    .addEdge("rag",       "generator")
    .addEdge("generator", END);

  return graph.compile();
}