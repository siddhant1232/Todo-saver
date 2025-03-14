import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import app from "./firebase";
import { useEffect, useState, useRef } from "react";

const db = getDatabase(app);

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const InputField: React.FC<InputProps> = ({ inputRef, value, onChange, onKeyDown, placeholder }) => {
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
    />
  );
};

const App: React.FC = () => {
  const [task, setTask] = useState("");
  const [todoData, setTodoData] = useState<Array<{ id: string; task: string }> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeypress = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener("keydown", handleKeypress);
    return () => {
      document.removeEventListener("keydown", handleKeypress);
    };
  }, []);

  const handleSubmit = () => {
    if (!task.trim()) {
      alert("Task cannot be empty!");
      return;
    }
    const newTasks = push(ref(db, "users/tasks"));
    set(newTasks, { task });
    setTask("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const dbRef = ref(db, "users/tasks");
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksArray = Object.entries(snapshot.val()).map(([id, value]) => ({
          id,
          ...(value as unknown as { task: string }),
        }));
        setTodoData(tasksArray);
      } else {
        setTodoData(null);
      }
    });
  }, []);

  const handleDelete = (taskId: string) => {
    const taskRef = ref(db, `users/tasks/${taskId}`);
    remove(taskRef)
      .then(() => console.log("Task deleted"))
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 p-4">
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Task Manager</h1>

        {/* Input Field + Add Button */}
        <div className="flex space-x-2 mb-6">
          <InputField
            inputRef={inputRef}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your task..."
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white text-xl rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            +
          </button>
        </div>

        {/* Task List */}
        {todoData ? (
          <ul className="space-y-3">
            {todoData.map(({ id, task }) => (
              <li
                key={id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md transition hover:scale-105"
              >
                <span className="text-lg font-medium text-gray-800">{task}</span>
                <button
                  onClick={() => handleDelete(id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default App;
