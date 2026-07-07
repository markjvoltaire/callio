export default function HeaderClouds() {
  return (
    <div className="home-feed__clouds" aria-hidden="true">
      <img
        className="home-feed__clouds-photo"
        src={`${process.env.PUBLIC_URL}/header-clouds.jpg`}
        alt=""
      />
      <img
        className="home-feed__header-icon"
        src={`${process.env.PUBLIC_URL}/callio-figures.png`}
        alt=""
      />
    </div>
  );
}
