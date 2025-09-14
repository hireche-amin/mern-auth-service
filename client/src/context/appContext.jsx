/**
 * Application Context (AppContext)
 * 
 * Creates a React Context object to serve as a central store for global state
 * that needs to be accessible across multiple components in the application.
 * 
 * This context is designed to be used with the `useContext` hook and an associated
 * `AppProvider` component that will wrap the application and provide the state values.
 * 
 * @context
 * @type {React.Context}
 */
import { createContext } from "react";

// Create and export the context instance.
// The empty object `{}` provided as a default value can serve as a placeholder
// for the intended structure of the context data, helping with autocompletion and predictability.
const AppContext = createContext({});

export default AppContext;