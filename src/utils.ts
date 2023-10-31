import { interpolateHcl as interpolateGradient } from 'd3-interpolate';

export const calculateArcColor = (index0: number, segments: number, gradientColorFrom: string, gradientColorTo: string) => {
  const interpolate = interpolateGradient(gradientColorFrom, gradientColorTo);

  return {
    fromColor: interpolate(index0 / segments),
    toColor: interpolate((index0 + 1) / segments),
  }
}

export const calculateArcCircle = (index0: number, segments: number, radius: number, startAngle0: number = 0, angleLength0: number = 2 * Math.PI) => {
  // Add 0.0001 to the possible angle so when start = stop angle, whole circle is drawn
  const startAngle = startAngle0 % (2 * Math.PI);
  const angleLength = angleLength0 % (2 * Math.PI);
  const index = index0 + 1;
  const fromAngle = angleLength / segments * (index - 1) + startAngle;
  const toAngle = angleLength / segments * index + startAngle;
  const fromX = radius * Math.sin(fromAngle);
  const fromY = -radius * Math.cos(fromAngle);
  const realToX = radius * Math.sin(toAngle);
  const realToY = -radius * Math.cos(toAngle);

  // add 0.005 to start drawing a little bit earlier so segments stick together
  const toX = radius * Math.sin(toAngle + 0.005);
  const toY = -radius * Math.cos(toAngle + 0.005);

  return {
    fromX,
    fromY,
    toX,
    toY,
    realToX,
    realToY,
  };
}

export const getGradientId = (index: number) => {
  return `gradient${index}`;
}
