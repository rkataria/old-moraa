export default async function CreateContentPackModal() {
  const createContentPack = () => {}

  return (
    <div>
      <div>
        <input placeholder="Enter content pack name" />
      </div>
      <div>
        <input placeholder="Enter content pack description" />
      </div>
      <button onClick={createContentPack}>Create</button>
    </div>
  )
}
