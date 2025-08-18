const SeasonalFlowers = () => {
  const seasonal_flowers = [
    {
      id: 1,
      src: "/spring_flower.jpg",
      title: "Spring Blooms",
      desc: "Explore vibrant flowers that flourish in spring.",
    },
    {
      id: 2,
      src: "/summer_flower.jpg",
      title: "Summer Radiance",
      desc: "Enjoy the colors of summer with these beautiful flowers.",
    },
    {
      id: 3,
      src: "/autumn_flower.jpg",
      title: "Autumn Hues",
      desc: "Discover the rich tones of autumn blooms.",
    },
    {
      id: 4,
      src: "/winter_flower.jpg",
      title: "Winter Whites",
      desc: "Find the elegance of winter flowers.",
    },
  ];

  return (
    <section>
      <h1 className="text-3xl mt-6 text-center font-bold">Seasonal Flowers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {seasonal_flowers.map((flower) => (
          <div
            key={flower.id}
            className="card card-compact bg-white shadow-xl rounded-md"
          >
            <figure>
              <img
                src={flower.src}
                alt={flower.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{flower.title}</h2>
              <p>{flower.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeasonalFlowers;