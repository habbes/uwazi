import {neo4jurl} from '../config/database.js';
import {v1} from 'neo4j-driver';
export default v1.driver(neo4jurl, v1.auth.basic('neo4j', '1234'));
