// Run the contracts project's runtime tests against this SDK without editing that project.
export async function resolve (specifier, context, nextResolve) {
  if (specifier === '@influenceth/sdk') {
    return { url: new URL('../../../build/index.js', import.meta.url).href, shortCircuit: true };
  }
  if (specifier.endsWith('/bin/lib/missionObservation.js')) {
    return { url: new URL('./sdk-adapter.mjs', import.meta.url).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
