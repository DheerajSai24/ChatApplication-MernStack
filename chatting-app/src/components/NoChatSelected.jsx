import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-gradient-to-br from-base-100 via-base-200 to-base-100">
      <div className="max-w-md text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center
             justify-center animate-pulse shadow-xl"
            >
              <MessageSquare className="w-12 h-12 text-primary" />
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/30 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary/20 rounded-full"></div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to Chatty!
        </h2>
        <p className="text-base-content/60 text-lg">
          Select a conversation from the sidebar to start chatting
        </p>
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Ready to connect
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
