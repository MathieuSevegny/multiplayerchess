import {v4 as uuidv4} from 'uuid';

/**
 * Crée une clé unique.
 * @returns 
 */
export function createRandomKey() : string{
    return uuidv4();
}