export default function UserCounter({ clientCount }) {
    return (
        <div className="flex items-center text-white">
            <span className="mr-2">Users Connected:</span>
            <span className="text-lg font-bold">{clientCount}</span>
        </div>
    );
}