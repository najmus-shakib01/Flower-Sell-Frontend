import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";

const BehindTheScenesAndCareTips = () => {
  const fetchCareTips = async () => {
    const response = await axios.get(`${baseUrl}/flower/care_tips/`);
    return response.data;
  };

  const {
    data: careTips,
    isLoading: careTipsLoading,
    isError: careTipsError,
  } = useQuery({
    queryKey: ["careTips"],
    queryFn: fetchCareTips,
  });

  return (
    <>
      {/* Behind The Scenes */}
      <section>
        <div className="bg-[#dbf7f9] rounded-lg">
          <div className="max-w-5xl mx-auto text-center px-6 mt-9 p-5">
            <h2 className="text-3xl font-bold text-gray-800">
              Behind The Scenes
            </h2>
            <div className="flex gap-10 flex-col md:flex-row items-center mt-9">
              <img
                src="/flower_preparation2.jpg"
                alt="Flower Preparation"
                className="w-full md:w-1/2 h-64 rounded-lg"
              />
              <div className="md:w-1/2 text-gray-700">
                <p className="text-lg">
                  See how our beautiful flowers are prepared and arranged before
                  they reach you. We take great care in selecting the freshest
                  blooms and creating stunning arrangements for every occasion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flower Care Tips */}
      <section>
        <div className="max-w-screen-xl mx-auto py-3">
          <h2 className="text-center text-3xl font-bold">Flower Care Tips</h2>
          <p className="text-center text-gray-700 mb-8">
            Learn how to take care of your flowers with expert tips.
          </p>

          {careTipsLoading ? (
            <Loader />
          ) : careTipsError ? (
            <p className="text-center text-red-500">Error loading care tips.</p>
          ) : (
            <div style={{ lineHeight: "30px" }}>
              {careTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white shadow-lg rounded-lg p-6 borde border-gray-200"
                >
                  <div className="whitespace-pre-line break-words leading-9 text-justify">
                    <h3 className="text-xl font-semibold text-primary">
                      🌿 {tip.plant_name}
                    </h3>
                    <p>
                      <b>Symptoms : </b> {tip.symptoms}
                    </p>
                    <b>Revival Steps : </b>
                    <p>{tip.revival_steps}</p>
                    <p>
                      <b>Recommended Fertilizer : </b>{" "}
                      {tip.recommended_fertilizer}
                    </p>
                    <p>
                      <b>Watering Caution : </b> {tip.watering_caution}
                    </p>
                    <p>
                      <b>Sunlight Adjustment : </b> {tip.sunlight_adjustment}
                    </p>
                    <p>
                      <b>Sunlight Needs : </b> {tip.sunlight_needs}
                    </p>
                    <p>
                      <b>Recommended Water Frequency : </b>{" "}
                      {tip.recommended_water_frequency}
                    </p>
                    <p>
                      <b>Created At : </b>{" "}
                      {new Date(tip.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <b>Updated At : </b>{" "}
                      {new Date(tip.updated_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 italic">
                      <b>Special Notes : </b>{" "}
                      {tip.special_notes || "No special notes"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BehindTheScenesAndCareTips;