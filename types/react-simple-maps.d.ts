declare module "react-simple-maps" {
  import type { ReactNode, CSSProperties } from "react";

  export type GeographyProps = {
    geography: unknown;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    className?: string;
  };

  export type MarkerProps = {
    coordinates: [number, number];
    children?: ReactNode;
  };

  export type ComposableMapProps = {
    projection?: string;
    projectionConfig?: Record<string, number | [number, number]>;
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  };

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: {
    geography: string | object;
    children: (args: { geographies: Array<{ rsmKey: string; properties?: Record<string, string> }> }) => ReactNode;
  }): JSX.Element;
  export function Geography(props: GeographyProps & { geography: unknown }): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;

  export type ZoomableGroupProps = {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMoveStart?: (args: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (args: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (args: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  };

  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
}
