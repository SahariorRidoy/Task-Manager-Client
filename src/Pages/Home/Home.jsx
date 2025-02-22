import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { BsThreeDotsVertical } from "react-icons/bs";
export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editTask, setEditTask] = useState(null); // Track the task being edited
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("To-Do");

  // Fetch tasks
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/tasks");
      return response.data;
    },
  });

  // adding a new task
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      await axios.post("http://localhost:5000/tasks", newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refetch tasks after adding
      Swal.fire({
        position: "top-left",
        icon: "success",
        title: "Task Added Successfully!",
        showConfirmButton: false,
        timer: 1000,
      });
      refetch();
    },
  });

  // Function to handle adding a task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      Swal.fire({
        position: "top-left",
        icon: "error",
        title: "Give your task a title!",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const newTask = {
      title,
      description,
      timestamp: new Date().toISOString(),
      category,
    };

    addTaskMutation.mutate(newTask);
    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  //deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refetch tasks after deletion
      Swal.fire({
        position: "top-left",
        icon: "success",
        title: "Task Deleted Successfully!",
        showConfirmButton: false,
        timer: 1000,
      });
    },
  });

  // Handle menu toggle
  const toggleMenu = (taskId) => {
    setMenuOpen(menuOpen === taskId ? null : taskId); // Toggle the menu
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(taskId);
      }
    });
  };

  // Edit Task
  const editTaskMutation = useMutation({
    mutationFn: async (updatedTask) => {
      await axios.put(
        `http://localhost:5000/tasks/${updatedTask._id}`,
        updatedTask
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh tasks
      Swal.fire({
        position: "top-left",
        icon: "success",
        title: "Task Updated Successfully!",
        showConfirmButton: false,
        timer: 1000,
      });
      setEditTask(null); // Close edit mode
    },
  });
  // Handle edit task
  const handleEditTask = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditCategory(task.category);
    setMenuOpen(null); // Close menu after clicking Edit
  };
  // Handle updating the task
  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      Swal.fire({
        position: "top-left",
        icon: "error",
        title: "Task title cannot be empty!",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const updatedTask = {
      _id: editTask._id,
      title: editTitle,
      description: editDescription,
      category: editCategory,
      timestamp: editTask.timestamp,
    };

    editTaskMutation.mutate(updatedTask);
  };

  if (isLoading)
    return <div className="text-center mt-10">Loading tasks...</div>;

  return (
    <div className="pt-6 max-w-[1320px] mx-auto min-h-[calc(80vh)]">
      <div className="flex gap-6 items-center">
        <h1 className="text-3xl">Welcome to Task Manager</h1>
        <button
          className="bg-purple-500 hover:bg-purple-800 cursor-pointer text-white rounded-md py-2 px-4"
          onClick={() => setShowForm(true)}
        >
          Add Task
        </button>
      </div>

      {/* Task Sections */}
      <div className="grid md:grid-cols-3 mt-6  mb-4 gap-6">
        {/* To-Do Section */}
        <div className="bg-purple-300 px-3 md:h-[675px] overflow-y-scroll">
          <div className="flex justify-center">
            <h3 className="text-xl text-purple-700 font-semibold pt-2 border-b-2 border-purple-600">
              To-Do
            </h3>
          </div>
          <div className="border-t w-full border-purple-700 mt-3"></div>

          {/* Task Form */}
          {showForm && (
            <div className="mt-4 p-4 bg-purple-200 border border-purple-500 rounded-lg">
              <h2 className="text-xl text-purple-600 font-semibold">
                Add New Task
              </h2>
              <input
                type="text"
                placeholder="Enter Task Title "
                maxLength="50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mt-2 border bg-white outline-purple-700 border-purple-500 rounded-md"
                required
              />
              <textarea
                placeholder="Enter Task Description (optional)"
                maxLength="200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mt-2 border bg-white outline-purple-700 border-purple-500 rounded-md"
              ></textarea>
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-700"
                  onClick={handleAddTask}
                >
                  Submit Task
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Display To-Do Tasks */}
          <div>
            {tasks
              .filter((task) => task.category === "To-Do")
              .map((task) =>
                editTask && editTask._id === task._id ? (
                  // Edit Form
                  <div
                    key={task._id}
                    className="mt-4 p-4 bg-purple-300 border border-purple-500 rounded-lg"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border border-purple-500 outline-purple-600 bg-purple-200 rounded-md"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 mt-2 border border-purple-500 outline-purple-600 bg-purple-200 rounded-md"
                    ></textarea>
                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-purple-500 hover:bg-purple-800 cursor-pointer text-white px-4 py-2 rounded-md"
                        onClick={handleUpdateTask}
                      >
                        Save Changes
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-700 cursor-pointer text-white px-4 py-2 rounded-md"
                        onClick={() => setEditTask(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal Task Display
                  <div
                    key={task._id}
                    className="flex justify-between mt-4 p-4 bg-purple-200 border border-purple-500 rounded-lg min-h-[150px] relative"
                  >
                    <div>
                      <h2 className="text-xl text-purple-600 font-semibold">
                        {task.title}
                      </h2>
                      <p className="text-purple-800">{task.description}</p>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        className="bg-purple-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-700"
                        onClick={() => toggleMenu(task._id)}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {menuOpen === task._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                          <button
                            className="w-full text-left cursor-pointer px-4 py-2 text-purple-600 hover:bg-purple-300"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full text-left cursor-pointer px-4 py-2 text-red-600 hover:bg-red-200"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        {/* In-Progress Section */}
        <div className="bg-orange-300 px-3">
          <div className="flex justify-center">
            <h3 className="text-xl text-orange-700 font-semibold pt-2 border-b-2 border-orange-600">
              In-Progress
            </h3>
          </div>
          <div className="border-t w-full border-orange-700 mt-3"></div>

          {/* Display In-Progress Tasks */}
          <div>
            {tasks
              .filter((task) => task.category === "In-Progress")
              .map((task) =>
                editTask && editTask._id === task._id ? (
                  // Edit Form
                  <div
                    key={task._id}
                    className="mt-4 p-4 bg-orange-200 border  border-orange-500 rounded-lg"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border bg-orange-100 outline-orange-600 border-orange-500 rounded-md"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 mt-2 border outline-orange-600 bg-orange-100 border-orange-500 rounded-md"
                    ></textarea>
                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-orange-500 hover:bg-orange-800 cursor-pointer text-white px-4 py-2 rounded-md"
                        onClick={handleUpdateTask}
                      >
                        Save Changes
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-700 cursor-pointer text-white px-4 py-2 rounded-md"
                        onClick={() => setEditTask(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal Task Display
                  <div
                    key={task._id}
                    className="flex justify-between mt-4 p-4 bg-orange-200 border border-orange-500 rounded-lg min-h-[150px] relative"
                  >
                    <div>
                      <h2 className="text-xl text-orange-600 font-semibold">
                        {task.title}
                      </h2>
                      <p className="text-orange-800">{task.description}</p>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        className="bg-orange-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-orange-700"
                        onClick={() => toggleMenu(task._id)}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {menuOpen === task._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                          <button
                            className="w-full text-left cursor-pointer px-4 py-2 text-orange-600 hover:bg-orange-300"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full text-left cursor-pointer px-4 py-2 text-red-600 hover:bg-red-200"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        {/* Done Section */}
        <div className="bg-green-200 px-3">
          <div className="flex justify-center">
            <h3 className="text-xl font-semibold text-green-600 pt-2 border-b-2 border-green-600">
              Done
            </h3>
          </div>
          <div className="border-t w-full border-green-700 mt-3"></div>

          {/* Display Done Tasks */}
          <div>
            {tasks
              .filter((task) => task.category === "Done")
              .map((task) =>
                editTask && editTask._id === task._id ? (
                  // Edit Form
                  <div
                    key={task._id}
                    className="mt-4 p-4 bg-green-200 border  border-green-500 rounded-lg"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border bg-green-100 outline-green-600 border-green-500 rounded-md"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 mt-2 border outline-green-600 bg-green-100 border-green-500 rounded-md"
                    ></textarea>
                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-green-500 hover:bg-green-800 cursor-pointer text-white px-4 py-2 rounded-md"
                        onClick={handleUpdateTask}
                      >
                        Save Changes
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-700 cursor-pointer text-white px-4 py-2 rounded-md"
                        onClick={() => setEditTask(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal Task Display
                  <div
                    key={task._id}
                    className="flex justify-between mt-4 p-4 bg-green-200 border border-green-500 rounded-lg min-h-[100px] relative"
                  >
                    <div>
                      <h2 className="text-xl text-green-600 font-semibold">
                        {task.title}
                      </h2>
                      <p className="text-green-800">{task.description}</p>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700"
                        onClick={() => toggleMenu(task._id)}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {menuOpen === task._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                          <button
                            className="w-full text-left cursor-pointer px-4 py-2 text-green-600 hover:bg-green-300"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full text-left cursor-pointer px-4 py-2 text-red-600 hover:bg-red-200"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
