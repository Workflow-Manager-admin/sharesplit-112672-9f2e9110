import React, { useState } from 'react';
import './App.css';
import backgroundImage from './assets/splittrack-background.png';

// PUBLIC_INTERFACE
function App() {
  // App-wide authentication and feature management, can be replaced by Supabase hooks/EasyAuth in full version
  const [auth, setAuth] = useState({
    loggedIn: false,
    email: '',
    user: null,
  });
  const [view, setView] = useState('home'); // home | login | register | dashboard

  const handleLoginDemo = () => {
    setAuth({ loggedIn: true, email: 'demo@splittrack.app', user: { name: "Demo User" } });
    setView('dashboard');
  };

  const handleLogout = () => {
    setAuth({ loggedIn: false, email: '', user: null });
    setView('home');
  };

  // Placeholder for integration: This would be replaced by Supabase data logic.
  const [groups, setGroups] = useState([{ name: "Euro Trip", id: 1 }, { name: "Flatmates", id: 2 }]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Expenses and balances placeholder logic.
  const expensesDemo = [
    { id: 1, desc: "Dinner", amount: 64, paidBy: "Alice", for: ["Alice", "Bob", "Demo User"], group: 1 },
    { id: 2, desc: "Museum Tickets", amount: 36, paidBy: "Bob", for: ["Alice", "Bob", "Demo User"], group: 1 },
    { id: 3, desc: "Groceries", amount: 50, paidBy: "Demo User", for: ["Demo User", "Flatmate"], group: 2 }
  ];

  // Filter expenses for group
  const groupExpenses = expensesDemo.filter(e => e.group === selectedGroupId);

  // Demo member list (would come from group in real app)
  const members = selectedGroupId === 2
    ? ["Demo User", "Flatmate"]
    : ["Alice", "Bob", "Demo User"];

  // Compute balances (very simple/for demo: what does user owe/owed)
  function calcBalances(expenses, user) {
    const balances = {};
    members.forEach(m => (balances[m] = 0));
    expenses.forEach(e => {
      const share = e.amount / e.for.length;
      e.for.forEach(m => {
        if (m !== e.paidBy) balances[m] -= share;
        else balances[m] += e.amount - share;
      });
    });
    return balances;
  }

  // Responsive app background style
  const appStyle = {
    minHeight: '100vh',
    minWidth: '100vw',
    background: `url(${backgroundImage}) center/cover no-repeat fixed, linear-gradient(rgba(20,20,40,0.89),rgba(25,25,50,0.96))`,
    backgroundBlendMode: 'overlay',
    display: 'flex',
    flexDirection: 'column'
  };

  // Colors per palette
  const colorPrimary = "#007bff";
  const colorSecondary = "#6c757d";
  const colorAccent = "#17a2b8";

  // Main Layout
  return (
    <div className="splittrack-app" style={appStyle}>
      <nav className="navbar elevated">
        <div className="container nav-inner">
          <div className="logo">
            <span className="splittrack-icon" title="Split Track">🧮</span>
            <span className="splittrack-title-main">Split <span className="track-accent">Track</span></span>
          </div>
          {auth.loggedIn ? (
            <div className="nav-user">
              <span className="user-name">{auth.user && auth.user.name}</span>
              <button className="btn nav-btn" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <div>
              <button className="btn nav-btn" onClick={() => setView('login')}>Login</button>
              <button className="btn nav-btn btn-accent" onClick={() => setView('register')}>Get Started</button>
            </div>
          )}
        </div>
      </nav>

      <main className="main-area">
        <div className="container">
          {/* Home page */}
          {!auth.loggedIn && (view === 'home') && (
            <section className="hero-card animated">
              <div className="hero-content">
                <span className="subtitle bold" style={{ color: colorAccent }}>Effortless Group Expenses</span>
                <h1 className="big-title"><b>Split Track</b></h1>
                <div className="description enhanced">
                  <b>Share. Track. Settle.</b> <br />
                  Modern <span style={{ color: colorPrimary}}>group expense</span> management:
                  <ul className="hero-list">
                    <li>✨ Add your friends and create groups</li>
                    <li>💸 Record shared expenses in a snap</li>
                    <li>📊 Instantly see who owes who</li>
                  </ul>
                  <span style={{
                    display: 'inline-block', color: colorAccent, fontWeight: 500, marginTop: 10, fontSize: '1.1rem'
                  }}>Zero awkwardness. 100% transparency.</span>
                </div>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
                  <button className="btn btn-large btn-accent" onClick={() => setView('register')}>Create Your Group</button>
                  <button className="btn btn-large btn-outline" onClick={() => setView('login')}>Sign In</button>
                </div>
              </div>
            </section>
          )}

          {/* Login/Register */}
          {!auth.loggedIn && (view === 'login' || view === 'register') && (
            <section className="auth-card elevated">
              <h2>{view === 'login' ? 'Sign In' : 'Create Account'}</h2>
              <form style={{ width: "100%", maxWidth: 360, margin: "auto" }} onSubmit={e => { e.preventDefault(); handleLoginDemo(); }}>
                <label>Email
                  <input className="input" type="email" required placeholder="you@email.com" />
                </label>
                <label>Password
                  <input className="input" type="password" required autoComplete="new-password" placeholder="Password" />
                </label>
                <div style={{ marginTop: 20 }}>
                  <button className="btn btn-large btn-primary" type="submit">
                    {view === 'login' ? 'Sign In' : 'Register'}
                  </button>
                </div>
              </form>
              <div style={{ marginTop: 20 }}>
                <a href="#" onClick={() => setView(view === 'login' ? 'register' : 'login')}>
                  {view === 'login' ? "Need an account? Register" : "Have an account? Sign in"}
                </a>
              </div>
              <div style={{ marginTop: 10, color: "#888" }}>
                <span style={{ fontSize: 13 }}>This is a demo – Connect to Supabase for live auth.</span>
              </div>
            </section>
          )}

          {/* Dashboard */}
          {auth.loggedIn && (view === 'dashboard') && (
            <section className="dashboard-area">
              <div className="dash-header">
                <span className="dashboard-title">Your Groups</span>
                <button className="btn btn-accent" onClick={() => setGroups([...groups, { name: `New Group ${groups.length+1}`, id: Date.now() }])}>
                  + New Group
                </button>
              </div>
              <div className="dash-groups" role="list">
                {groups.map(g => (
                  <div key={g.id} className={`group-tile elevated ${selectedGroupId === g.id ? 'active' : ''}`}
                       tabIndex={0}
                       onClick={() => setSelectedGroupId(g.id)} onKeyPress={e => (e.key === "Enter") && setSelectedGroupId(g.id)}>
                    <span className="group-name">{g.name}</span>
                  </div>
                ))}
              </div>
              {selectedGroupId &&
                <div className="group-details elevated">
                  <h3>Expenses for <span className="group-highlight">{groups.find(g => g.id === selectedGroupId).name}</span></h3>
                  <div className="expense-list">
                    {groupExpenses.map(e => (
                      <div className="expense-item" key={e.id}>
                        <span className="expense-desc">{e.desc}</span>
                        <span className="expense-meta">
                          <span className="expense-amount">${e.amount}</span> <span className="expense-paidby">Paid by {e.paidBy}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <form className="expense-form" onSubmit={e => { e.preventDefault(); }}>
                    <input className="input" placeholder="Description" required />
                    <input className="input" type="number" placeholder="Amount" min="1" required />
                    <select className="input" required>
                      {members.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <button className="btn btn-primary" type="submit">Add Expense</button>
                  </form>

                  {/* Balances display */}
                  <div className="balances-summary elevated">
                    <h4>Balances</h4>
                    <div className="balances-list">
                      {Object.entries(calcBalances(groupExpenses, auth.user && auth.user.name)).map(([name, amount]) => (
                        <div className={`balance-item ${amount < 0 ? 'negative' : (amount > 0 ? 'positive' : '')}`} key={name}>
                          <span>{name}</span>
                          <span>{amount >= 0 ? `Is owed $${Math.abs(amount).toFixed(2)}` : `Owes $${Math.abs(amount).toFixed(2)}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            </section>
          )}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span>© {new Date().getFullYear()} Split Track • Built for effortless sharing.</span>
            <span className="footer-links">
              <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">Supabase</a>
              <span style={{ margin: '0 8px' }}>•</span>
              <a href="https://kavia.com/" target="_blank" rel="noopener noreferrer">Kavia AI</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
