const FloralArrangementIdeas = () => {
  const floral_arrangement_ideas = [
    {
      id: 1,
      src: "/wedding_arrangement.jpg",
      title: "Wedding Centerpiece",
      desc: "Elegant floral arrangements for your special day.",
    },
    {
      id: 2,
      src: "/home_decoration.jpg",
      title: "Home Decoration",
      desc: "Add beauty to your home with these ideas.",
    },
    {
      id: 3,
      src: "/table_setting.jpg",
      title: "Table Settings",
      desc: "Beautiful centerpieces for your dining table.",
    },
  ];

  return (
    <section>
      <h1 className="text-3xl mt-6 text-center font-bold">
        Floral Arrangement Ideas
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-8">
        {floral_arrangement_ideas.map((idea) => (
          <div
            key={idea.id}
            className="card card-compact bg-white shadow-xl rounded-md"
          >
            <figure>
              <img
                src={idea.src}
                alt={idea.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{idea.title}</h2>
              <p>{idea.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FloralArrangementIdeas;
