
export default async function Home() {
  async function getWorkoutOverview() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/auth/workouts/7bf2134c-793f-4aee-9b6b-a29980d9b027/overview`,
        {
          cache: "no-store", // or 'force-cache' for caching
        }
      );
      console.log(response);
      return response.json();
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const res = await getWorkoutOverview();
    console.log("Workout Overview:", res);
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <h1 className="text-3xl" >heyyy</h1>
    </div>
  );
}
