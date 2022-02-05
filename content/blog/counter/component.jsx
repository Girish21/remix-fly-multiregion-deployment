import * as React from "react";

export default function () {
  const [count, setCount] = React.useState(0);

  return (
    <section>
      <div>{count}</div>
      <div>
        <button onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </section>
  );
}
