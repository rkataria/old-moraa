const contents = []

export default async function Index() {
  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-black">Content Deck</h2>
          <p className="text-md font-normal text-gray-600">
            Content Deck is a tool for creating and managing content.
          </p>
        </div>
        <div>
          <button className="px-6 py-2 text-white bg-black rounded-md">
            Add Content
          </button>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-black">Recent Contents</h3>
        <div>
          {contents.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 mt-4">
              <span className="text-gray-600">No content found.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
