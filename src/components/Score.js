export default function score({ status }) {
  return (
    <div className="box" style={{ marginTop: 50 }}>
      <div className="content">
        <div className="columns">
          {/* <div className="column">
            <h1 className="title has-text-centered">
              Score:
              <span
                className="tag is-success is-large is-rounded"
                style={{ marginLeft: 10 }}
              >
                90 / 100
              </span>
            </h1>
          </div> */}
          <div className="column">
            <h1 className="title has-text-centered">
              Result:
              <span
                className={`tag is-large is-rounded ${
                  status === "LEGIT"
                    ? "is-success"
                    : status === "GOOD"
                    ? "is-info"
                    : "is-warning"
                }`}
                style={{ marginLeft: 10 }}
              >
                {status || "-"}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
