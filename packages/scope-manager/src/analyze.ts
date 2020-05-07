import {
  TSESLint,
  TSESTree,
  visitorKeys,
} from '@typescript-eslint/experimental-utils';
import { Referencer, ReferencerOptions } from './referencer';
import { ScopeManager } from './ScopeManager';

interface AnalyzeOptions {
  /**
   * whether the whole script is executed under node.js environment.
   * When enabled, the scope manager adds a function scope immediately following the global scope.
   */
  globalReturn?: boolean;

  /**
   * implied strict mode (if ecmaVersion >= 5).
   */
  impliedStrict?: boolean;

  /**
   * the source type of the script.
   */
  sourceType?: 'script' | 'module';

  /**
   * which ECMAScript version is considered
   */
  ecmaVersion?: TSESLint.EcmaVersion;

  /**
   * Additional known visitor keys.
   */
  childVisitorKeys?: ReferencerOptions['childVisitorKeys'];

  /**
   * A kind of the fallback in order to encounter with unknown node.
   * See [esrecurse](https://github.com/estools/esrecurse)'s the `fallback` option.
   */
  fallback?: ReferencerOptions['fallback'];
}

const DEFAULT_OPTIONS: AnalyzeOptions = {
  globalReturn: false,
  impliedStrict: false,
  sourceType: 'script',
  ecmaVersion: 2018,
  childVisitorKeys: visitorKeys,
  fallback: 'iteration',
};

/**
 * Takes an AST and returns the analyzed scopes.
 */
function analyze(
  tree: TSESTree.Node,
  providedOptions?: AnalyzeOptions,
): ScopeManager {
  const options = Object.assign({}, DEFAULT_OPTIONS, providedOptions);
  const scopeManager = new ScopeManager(options);
  const referencer = new Referencer(options, scopeManager);

  referencer.visit(tree);

  return scopeManager;
}

export * from './definition';
export { Reference } from './referencer/Reference';
export * from './scope';
export { ScopeManager } from './ScopeManager';
export { Variable } from './Variable';
export { analyze, AnalyzeOptions };