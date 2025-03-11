export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            © {new Date().getFullYear()} Your Website. All rights reserved.
          </p>
          <a
            href="https://github.com/lzpdark/boardui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline mt-2 md:mt-0"
          >
            开源代码在 GitHub
          </a>
        </div>
      </footer>
    );
  }