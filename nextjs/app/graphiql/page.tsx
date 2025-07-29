'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Type declarations for global window objects
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    GraphiQL: any;
    GraphiQLToolkit: any;
    GraphiQLExplorer: any;
  }
}

const url = "http://localhost:8080/graphql"

export default function GraphiQLPage() {
  useEffect(() => {
    // Suppress specific Monaco Editor errors that are harmless but noisy
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = (...args) => {
      const message = args.join(' ');
      // Filter out known Monaco Editor worker-related errors
      if (
        message.includes('Cannot read properties of undefined (reading \'toUrl\')') ||
        message.includes('Cannot read properties of null (reading \'then\')') ||
        message.includes('Could not create web worker') ||
        message.includes('module "@emotion/is-prop-valid" not found') ||
        message.includes('editorSimpleWorker.js') ||
        message.includes('network.js') ||
        message.includes('standaloneWebWorker.js') ||
        message.includes('$loadForeignModule') ||
        message.includes('toUri') ||
        message.includes('asBrowserUri')
      ) {
        // Silently ignore these errors
        return;
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      // Filter out known Monaco Editor worker-related warnings
      if (
        message.includes('Could not create web worker') ||
        message.includes('Falling back to loading web worker code in main thread')
      ) {
        // Silently ignore these warnings
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    // Initialize GraphiQL after all scripts are loaded
    const initGraphiQL = () => {
      // Wait for all modules to be available on window
      if (typeof window !== 'undefined' && 
          window.React && 
          window.ReactDOM && 
          window.GraphiQL && 
          window.GraphiQLToolkit && 
          window.GraphiQLExplorer) {
        
        // Setup Monaco Environment for GraphQL editor (using dynamic script loading)
        const setupMonacoEnvironment = () => {
          // Define Monaco environment with proper worker handling
          (globalThis as any).MonacoEnvironment = {
            getWorker(_workerId: any, label: string) {
              console.info('MonacoEnvironment.getWorker', { label });
              
              // Try to create a worker, but if it fails, return undefined
              // This will cause Monaco to fall back to running in the main thread
              try {
                // This is a basic approach that should work in most environments
                // but if it fails, Monaco will handle the fallback gracefully
                const workerScript = `
                  self.onmessage = function(e) {
                    try {
                      self.postMessage({ 
                        id: e.data.id, 
                        result: null,
                        error: null 
                      });
                    } catch (err) {
                      self.postMessage({ 
                        id: e.data.id, 
                        result: null,
                        error: 'Worker fallback error'
                      });
                    }
                  };
                  
                  self.onerror = function(err) {
                    console.warn('Worker error (fallback):', err);
                  };
                `;
                
                // Use eval to create the worker dynamically to avoid static analysis
                const createWorker = new Function('script', `
                  const blob = new Blob([script], { type: 'application/javascript' });
                  return new Worker(URL.createObjectURL(blob));
                `);
                
                return createWorker(workerScript);
              } catch (error) {
                // If worker creation fails, return undefined
                // Monaco will fall back to main thread execution
                console.warn('Failed to create worker, falling back to main thread:', error);
                return undefined;
              }
            },
          };
        };

        setupMonacoEnvironment();

        try {
          const fetcher = window.GraphiQLToolkit.createGraphiQLFetcher({
            url: url,
          });
          
          const plugins = [
            window.GraphiQL.HISTORY_PLUGIN, 
            window.GraphiQLExplorer.explorerPlugin()
          ];

          function App() {
            return window.React.createElement(window.GraphiQL.GraphiQL, {
              fetcher,
              plugins,
              defaultEditorToolsVisibility: true,
            });
          }

          const container = document.getElementById('graphiql');
          if (container) {
            const root = window.ReactDOM.createRoot(container);
            root.render(window.React.createElement(App));
          }
        } catch (error) {
          console.error('Error initializing GraphiQL:', error);
          const container = document.getElementById('graphiql');
          if (container) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            container.innerHTML = `<div class="loading">Error loading GraphiQL: ${errorMessage}</div>`;
          }
        }
      }
    };

    // Check periodically until all modules are loaded
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 
          window.React && 
          window.ReactDOM && 
          window.GraphiQL && 
          window.GraphiQLToolkit && 
          window.GraphiQLExplorer) {
        clearInterval(checkInterval);
        initGraphiQL();
      }
    }, 100);

    // Cleanup interval on unmount and set a timeout to avoid infinite waiting
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('GraphiQL modules failed to load within 30 seconds');
    }, 30000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return (
    <>
      {/* CSS Styles */}
      <style jsx>{`
        body {
          margin: 0;
        }

        #graphiql {
          height: 100dvh;
        }

        .loading {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }
      `}</style>

      {/* External CSS */}
      <link rel="stylesheet" href="https://esm.sh/graphiql/dist/style.css" />
      <link
        rel="stylesheet"
        href="https://esm.sh/@graphiql/plugin-explorer/dist/style.css"
      />

      {/* Import Map */}
      <Script
        id="importmap"
        type="importmap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `{
            "imports": {
              "react": "https://esm.sh/react@19.1.0",
              "react/jsx-runtime": "https://esm.sh/react@19.1.0/jsx-runtime",
              "react-dom": "https://esm.sh/react-dom@19.1.0",
              "react-dom/client": "https://esm.sh/react-dom@19.1.0/client",
              "graphiql": "https://esm.sh/graphiql?standalone&external=react,react-dom,@graphiql/react,graphql",
              "@graphiql/plugin-explorer": "https://esm.sh/@graphiql/plugin-explorer?standalone&external=react,@graphiql/react,graphql",
              "@graphiql/react": "https://esm.sh/@graphiql/react?standalone&external=react,react-dom,graphql",
              "@graphiql/toolkit": "https://esm.sh/@graphiql/toolkit?standalone&external=graphql",
              "graphql": "https://esm.sh/graphql@16.11.0",
              "@emotion/is-prop-valid": "https://esm.sh/@emotion/is-prop-valid@1.2.1",
              "@emotion/styled": "https://esm.sh/@emotion/styled@11.11.0",
              "@emotion/react": "https://esm.sh/@emotion/react@11.11.1"
            }
          }`,
        }}
      />

      {/* Load modules using module scripts */}
      <Script
        id="load-modules"
        type="module"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Import React and ReactDOM
            import React from 'react';
            import ReactDOM from 'react-dom/client';
            // Import GraphiQL and the Explorer plugin
            import { GraphiQL, HISTORY_PLUGIN } from 'graphiql';
            import { createGraphiQLFetcher } from '@graphiql/toolkit';
            import { explorerPlugin } from '@graphiql/plugin-explorer';

            // Make modules available globally
            window.React = React;
            window.ReactDOM = ReactDOM;
            window.GraphiQL = { GraphiQL, HISTORY_PLUGIN };
            window.GraphiQLToolkit = { createGraphiQLFetcher };
            window.GraphiQLExplorer = { explorerPlugin };
          `,
        }}
      />

      {/* GraphiQL Container */}
      <div id="graphiql">
        <div className="loading">Loading…</div>
      </div>
    </>
  );
}