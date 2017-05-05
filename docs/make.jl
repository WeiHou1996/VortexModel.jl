using Documenter, VortexModel

makedocs(
    format =:html,
    sitename = "VortexModel.jl",
    pages = [
        "Home" => "index.md",
        "Getting Started Guide" => "quickstart.md",
        "Vortex Elements" => "elements.md",
        "Computing Velocities" => "velocities.md",
        "Time Marching" => "timemarching.md"
    ]
)

if "DOCUMENTER_KEY" in keys(ENV)
    deploydocs(
     repo = "github.com/darwindarak/VortexModel.jl.git",
     target = "build"
    )
end
