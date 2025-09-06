import "./styles.css";

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="main-title">
          Sri Adinath Jain Shwetamber Sangh, Chickpet, Bangalore
        </h1>
        <h2 className="sub-title">In coordination with</h2>
        <p>Sri Vasupujya Jain Shwetamber Sangh, Akkipet</p>
        <p>Sri Ajitnath Jain Shwetamber Sangh, Nagarthpet</p>

        <p>Presents a Camp on Self Defence</p>
        <p>By A Team of Expert Trainers</p>

        <p className="event-dates">27-Sep to 05-Oct</p>
        <p className="event-time">6.15 AM to 8.00 AM</p>
        <p>For 15 to 25 Years, Boys & Girls</p>
      </header>
      {/* <h2 className="highlight">💳 UPI Payment</h2> */}

      <p className="venue">📍 Venue: Soham Hall, Chickpet</p>
    </div>
  );
}
