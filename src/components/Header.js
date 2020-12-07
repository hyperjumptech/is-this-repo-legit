const Header = () => {
  return (
    <nav
      className="navbar has-shadow is-spaced-small"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <h2 className="subtitle"><strong>Is This Repo Legit</strong></h2>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Header