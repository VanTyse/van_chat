import './index.css'

export const Loader = () => {
    return (
        <div className="loader">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="80px" height="80px">
                    <defs>
                        <linearGradient id="GradientColor">
                        <stop offset="0%" stop-color="#e91e63" />
                        <stop offset="100%" stop-color="#673ab7" />
                        </linearGradient>
                    </defs>
                    <circle cx="40" cy="40" r="20" stroke-linecap="round" />
            </svg>
        </div>
    )
}