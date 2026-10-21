export default function notFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-300 p-6">
      <h1 className="text-4xl font-bold text-gray-700 mb-3">
        This page is not found! 
      </h1>
      <p className="text-lg text-gray-500 mb-6">
        Please try again later or refresh the page.
      </p>
    </div>
  );
}
