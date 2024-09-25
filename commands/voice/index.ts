import type { Command } from "../../types/command";
import type { Connection } from "../../types/connection";
import { join } from "./join";
import { play } from "./play";

export const Connections: Map<string, Connection> = new Map();
