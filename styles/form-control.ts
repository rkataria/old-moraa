const styles = {
  formControl: {
    base: "flex flex-col mb-4",
    error: "flex flex-col mb-4",
  },
  input: {
    base: "block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6",
    error:
      "block flex-1 border-0 bg-transparent py-1.5 text-red-600 placeholder:text-red-400 focus:ring-0 sm:text-sm sm:leading-6",
  },
  textarea: {
    base: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
    error:
      "block w-full rounded-md border-0 py-1.5 text-red-600 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
  },
  select: {
    base: "block w-full border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6",
    error:
      "block w-full border-0 bg-transparent py-1.5 text-red-600 placeholder:text-red-400 focus:ring-0 sm:text-sm sm:leading-6",
  },
  label: {
    base: "block text-sm font-medium leading-6 text-gray-900 mb-1.5",
    error: "block text-sm font-medium leading-6 text-red-600 mb-1.5",
  },
  error: "text-red-600",
  button: {
    base: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
    error:
      "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
  },
  buttonDisabled:
    "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed",
}

export default styles
