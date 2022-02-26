import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { SketchProps } from "react-p5";
import p5Types from "p5";
import styles from "../styles/Home.module.css";
import { useState } from "react";

class Curve {
  private path: Point[];

  constructor() {
    this.path = [];
  }

  addPoint(point: Point) {
    this.path.push(point);
  }

  getPath() {
    return this.path;
  }
}

class Point {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}

const Sketch = dynamic<SketchProps>(
  () => import("react-p5").then((mod) => mod.default),
  {
    ssr: false,
  }
);

let size = 0;
let distance = 0;

const Home: NextPage = () => {
  const [data, setData] = useState({ w_1: 1, w_2: 1, phi: 0 });
  const phi = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI];
  let curve = new Curve();
  let t = 0;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const cssStyleDeclaration = getComputedStyle(canvasParentRef);
    const width = parseInt(cssStyleDeclaration.width.split("px")[0]);
    const height = parseInt(cssStyleDeclaration.height.split("px")[0]);
    size = Math.min(width, height) / 2;
    distance = size / 2;
    p5.createCanvas(size, size).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    let A = (distance - 5) / 2;
    p5.background(255);

    const posX_1 = distance / 2;
    const posY_1 = distance + distance / 2;

    const posX_2 = distance + distance / 2;
    const posY_2 = distance / 2;

    p5.ellipse(posX_1, posY_1, 2 * A, 2 * A);
    p5.ellipse(posX_2, posY_2, 2 * A, 2 * A);

    let x_1 = A * Math.cos(data.w_1 * t + data.phi);
    let y_1 = A * Math.sin(data.w_1 * t + data.phi);

    let y_2 = A * Math.cos(data.w_2 * t);
    let x_2 = A * Math.sin(data.w_2 * t);

    p5.strokeWeight(4);
    p5.point(posX_1 - x_1, posY_1 - y_1);
    p5.point(posX_2 + x_2, posY_2 - y_2);
    p5.strokeWeight(1);

    p5.strokeWeight(2);
    p5.beginShape();
    curve.getPath().forEach((point) => p5.vertex(point.getX(), point.getY()));
    p5.endShape();

    p5.strokeWeight(5);
    p5.point(posX_2 + x_2, posY_1 - y_1);
    p5.strokeWeight(1);

    p5.line(posX_2 + x_2, 0, posX_2 + x_2, size);
    p5.line(0, posY_1 - y_1, size, posY_1 - y_1);

    if (t < p5.TWO_PI) curve.addPoint(new Point(posX_2 + x_2, posY_1 - y_1));
    t += 0.02;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Lissajous cruve</title>
        <meta name="description" content="Lissajous curve generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <input
            onChange={(evt) => {
              const w_1 = parseInt(evt.target.value) | 0;
              setData({ ...data, w_1: w_1 });
            }}
            type="text"
            placeholder="w_1"
            value={data.w_1}
          />
          <input
            onChange={(evt) => {
              const w_2 = parseInt(evt.target.value) | 0;
              setData({ ...data, w_2: w_2 });
            }}
            type="text"
            placeholder="w_2"
            value={data.w_2}
          />
          <select
            name="phi"
            onChange={(evt) => {
              setData({ ...data, phi: phi[parseInt(evt.target.value)] });
            }}
          >
            <option value={0}>0</option>
            <option value={1}>π/4</option>
            <option value={2}>π/2</option>
            <option value={3}>3π/4</option>
            <option value={4}>π</option>
          </select>
        </div>

        <Sketch setup={setup} draw={draw} className={styles.sketch}></Sketch>
      </main>
    </div>
  );
};

export default Home;
