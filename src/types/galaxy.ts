/**
 * Core TypeScript types for Hidden Galaxy dependency visualization
 */

/**
 * Represents a single package/dependency as a node in 3D space
 */
export interface DependencyNode {
  id: string; // packageName@version (unique identifier)
  name: string; // Package name
  version: string; // Semantic version
  position: [number, number, number]; // 3D coordinates (x, y, z)
  size: number; // Sphere radius (based on importance)
  color: string; // Hex color (based on type/depth)
  connections: string[]; // Array of dependency IDs this node depends on
  importance: number; // Calculated metric (0-1 normalized)
}

/**
 * Complete dependency graph containing all nodes and their relationships
 */
export interface DependencyGraph {
  nodes: DependencyNode[]; // All packages in the graph
  links: DependencyLink[]; // All dependency relationships
}

/**
 * Link between two packages in the dependency graph
 */
export interface DependencyLink {
  source: string; // ID of the source package
  target: string; // ID of the target package (dependency)
}

/**
 * Raw metadata from package registries (npm/GitHub) for importance calculation
 */
export interface PackageMetadata {
  name: string; // Package name
  version: string; // Semantic version
  dependents?: number; // Number of packages that depend on this (optional)
  downloads?: number; // Monthly download count (optional)
  stars?: number; // GitHub stars count (optional)
}

/**
 * Props for the PackageSphere component (3D sphere representing a package)
 */
export interface PackageSphereProps {
  position: [number, number, number]; // 3D position in space
  size: number; // Sphere radius
  color: string; // Hex color value
  onClick: (id: string) => void; // Click handler receiving package ID
}

/**
 * Props for the main GalaxyScene component
 */
export interface GalaxySceneProps {
  data: DependencyGraph; // Complete dependency graph to visualize
}
