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

export default function GraphiQLPage() {
  useEffect(() => {
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
          // Define Monaco environment without importing workers
          (globalThis as any).MonacoEnvironment = {
            getWorker(_workerId: any, label: string) {
              console.info('MonacoEnvironment.getWorker', { label });
              // Return a simple worker placeholder for now
              return null;
            },
          };
        };

        setupMonacoEnvironment();

        const fetcher = window.GraphiQLToolkit.createGraphiQLFetcher({
          url: 'https://countries.trevorblades.com',
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

    // Cleanup interval on unmount
    return () => clearInterval(checkInterval);
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
              "graphql": "https://esm.sh/graphql@16.11.0"
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