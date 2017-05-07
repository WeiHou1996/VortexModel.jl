var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#VortexModel-1",
    "page": "Home",
    "title": "VortexModel",
    "category": "section",
    "text": "a scaffolding for building vortex modelsThe main goal of this library is to remove as much boilerplate code as possible from vortex modeling codes. The core operation in vortex models is simulating the dynamics of various interacting vortex elements. In general, the simulation comes down to computing the velocities of the vortex elements then applying some time-marching scheme to evolve the system forward in time. With this in mind, we want to construct a library that makes iteasy to define new vortex types and behaviors\nstraightforward for users to set up a system the vortex elements\nintuitive to probe the state of any vortex element in the system\neasy to define new time-marching schemes to fit the users needs"
},

{
    "location": "index.html#Installation-1",
    "page": "Home",
    "title": "Installation",
    "category": "section",
    "text": "This package requires Julia 0.6- and above. It is not a registered package, so it should be installed with:julia> Pkg.clone(\"git@github.com:darwindarak/VortexModel.jl.git\")Since it is still under heavy development, you should runjulia> Pkg.test(\"VortexModel\")to make sure things are working as intended.The plots in this documentation are generated using PyPlot.jl. You might want to install that too to follow the examples in the getting started guide or the Jupyter notebooks."
},

{
    "location": "quickstart.html#",
    "page": "Getting Started Guide",
    "title": "Getting Started Guide",
    "category": "page",
    "text": ""
},

{
    "location": "quickstart.html#getting-started-1",
    "page": "Getting Started Guide",
    "title": "Getting Started",
    "category": "section",
    "text": "This getting started guide will introduce the main components of VortexModel.jl. The code examples here should be directly copy-paste-able into the Julia REPL (even with the julia> prompt and sample results).DocTestSetup = quote\n    srand(1)\nend"
},

{
    "location": "quickstart.html#Creating-Vortex-Elements-1",
    "page": "Getting Started Guide",
    "title": "Creating Vortex Elements",
    "category": "section",
    "text": "We start by importing the library and creating a single point vortex with unit circulation located at (1,1):julia> using VortexModel\n\njulia> p = Vortex.Point( 1.0 + 1.0im, 1.0 )\nPoint Vortex: z = 1.0 + 1.0im, Γ = 1.0By convention, the arguments for vortex type constructors are position(s) and circulation(s), followed by any type specific parameters. For example, a vortex blob at the same location as p with a blob radius of 0.1 is created withjulia> Vortex.Blob(1.0 + 1.0im, 1.0, 0.1)\nVortex Blob: z = 1.0 + 1.0im, Γ = 1.0, δ = 0.1We can use Julia's vectorized dot syntax to construct whole arrays of vortex elements. For example, here we create five point vortices and five vortex blobs:julia> N = 5;\n\njulia> zs = Complex.(randn(N), randn(N));\n\njulia> points = Vortex.Point.(zs + 1.5, rand(N))\n5-element Array{VortexModel.Vortex.Points.Point,1}:\n Point Vortex: z = 1.797 + 0.311im, Γ = 0.425\n Point Vortex: z = 1.882 + 2.295im, Γ = 0.773\n Point Vortex: z = 0.902 - 2.267im, Γ = 0.281\n Point Vortex: z = 1.49 + 0.53im, Γ = 0.209\n Point Vortex: z = 0.661 + 0.431im, Γ = 0.251\n\njulia> blobs = Vortex.Blob.(zs - 1.5, rand(N), 0.1)\n5-element Array{VortexModel.Vortex.Blobs.Blob,1}:\n Vortex Blob: z = -1.203 + 0.311im, Γ = 0.02, δ = 0.1\n Vortex Blob: z = -1.118 + 2.295im, Γ = 0.288, δ = 0.1\n Vortex Blob: z = -2.098 - 2.267im, Γ = 0.86, δ = 0.1\n Vortex Blob: z = -1.51 + 0.53im, Γ = 0.077, δ = 0.1\n Vortex Blob: z = -2.339 + 0.431im, Γ = 0.64, δ = 0.1We can mix different vortex types together by grouping them in tuples. For example, a collection of vortex elements consisting of the point vortices and vortex blobs created earlier can be grouped together with:julia> sys = (points, blobs);note: Note\nThe Unicode characters used in the examples can be entered in the Julia REPL (and most text editors with the appropriate plugins) via tab completion..  For example:Γ: \\Gamma<TAB>\nΔ: \\Delta<TAB>\nẋ: x\\dot<TAB>\n🌀: \\:cyclone:<TAB>We can access properties of any vortex element by directly accessing its fields, for example:julia> p.Γ\n1.0However, it is better practice to use accessor methods, such as:julia> Vortex.circulation(p)\n1.0since not all vortex element types store their circulation in a Γ field but all types are required to implement a Vortex.circulation method (also see Vortex.impulse and Vortex.position). These accessor methods, combined with the dot syntax, also make it easier to work with properties of arrays and tuples of vortex elements.julia> Vortex.circulation(points)\n1.939982714228534\n\njulia> Vortex.circulation(blobs)\n1.8849356499471654\n\njulia> Vortex.circulation(sys)\n3.8249183641756996\n\njulia> Vortex.circulation.(blobs)\n5-element Array{Float64,1}:\n 0.0203749\n 0.287702\n 0.859512\n 0.0769509\n 0.640396\n\njulia> Vortex.position.(blobs)\n5-element Array{Complex{Float64},1}:\n -1.20271+0.311111im\n  -1.1176+2.29509im\n -2.09763-2.26709im\n -1.51045+0.529966im\n -2.33903+0.431422im"
},

{
    "location": "quickstart.html#Computing-Vortex-Velocities-1",
    "page": "Getting Started Guide",
    "title": "Computing Vortex Velocities",
    "category": "section",
    "text": "Now that we can create vortex elements, we want to add in some dynamics. The key functions for this are the induce_velocity and induce_velocity! pair and self_induce_velocity!.induce_velocity(target, source) computes the complex velocity that a vortex element(s) source induces on a target. The target can bea complex position\njulia> induce_velocity(0.0 + 0.0im , points)\n0.05610938572529216 - 0.1319030126670981im\n\njulia> induce_velocity(0.0 + 0.0im , sys)\n0.05066830110387291 - 0.04224547600656549im\na vortex element\njulia> induce_velocity(p, sys)\n-0.095439940976663 - 0.024542142467999073im\nan array/tuple of vortex elements\njulia> induce_velocity(points, blobs)\n5-element Array{Complex{Float64},1}:\n -0.00789749+0.0645051im\n  -0.0278927+0.0538741im\n   0.0271037+0.0706032im\n  -0.0111193+0.0675933im\n  -0.0117893+0.078857im\n\njulia> induce_velocity(blobs, sys)\n5-element Array{Complex{Float64},1}:\n  0.0126862+0.0352193im\n  -0.111207-0.0472771im\n  0.0873796-0.0535197im\n -0.0375196+0.031068im\n -0.0279267-0.103821imThe in-place version, induce_velocity!(velocities, targets, source), computes the velocity and writes the results into a pre-allocated data structure. For example:julia> vel_points = zeros(Complex128, length(points))\n5-element Array{Complex{Float64},1}:\n 0.0+0.0im\n 0.0+0.0im\n 0.0+0.0im\n 0.0+0.0im\n 0.0+0.0im\n\njulia> induce_velocity!(vel_points, points, blobs);\n\njulia> vel_points\n5-element Array{Complex{Float64},1}:\n -0.00789749+0.0645051im\n  -0.0278927+0.0538741im\n   0.0271037+0.0706032im\n  -0.0111193+0.0675933im\n  -0.0117893+0.078857imTo make it easier to allocate velocities for more complex collections of vortex elements, the library provides the allocate_velocity function:julia> vels = allocate_velocity(sys);\n\njulia> typeof(vels)\nTuple{Array{Complex{Float64},1},Array{Complex{Float64},1}}The code above created a tuple containing two arrays of velocities, corresponding to the structure of sys. Similarly, there is also the reset_velocity!(velocities, sources) function, which resizes the entries in velocities to match the structure of sources if necessary, then sets all velocities to zero. We can compute the velocity that a source induces on the entire points/blobs system with:julia> src = Vortex.Point(1.0, 1.0);\n\njulia> induce_velocity!(vels, sys, src)\n(Complex{Float64}[-0.067601+0.173242im, -0.0604154+0.023228im, 0.0700725-0.00301774im, -0.162041+0.149685im, -0.228068-0.179224im], Complex{Float64}[-0.0100056-0.0708409im, -0.0374576-0.0345609im, 0.0244871-0.033458im, -0.0128124-0.0606923im, -0.00605748-0.0468824im])If we want the velocity that the points/blobs system induces on itself, we can callreset_velocity!(vels, sys)\ninduce_velocity!(vels[1], points, points)\ninduce_velocity!(vels[1], points, src)\ninduce_velocity!(vels[2], blobs, src)\ninduce_velocity!(vels[2], blobs, blobs)This becomes difficult to keep track of when sys gets larger or more complicated (e.g. nested collection of elements). Instead, we can use the self_induce_velocity! function, which takes care of applying all the pairwise interactions (recursively if need be):julia> reset_velocity!(vels, sys);\n\njulia> self_induce_velocity!(vels, sys);"
},

{
    "location": "quickstart.html#Time-Marching-1",
    "page": "Getting Started Guide",
    "title": "Time Marching",
    "category": "section",
    "text": "using VortexModel\nusing PyPlot\nsrand(1)\n\nfunction plot_system(sys, filename)\n    clf()\n    for cluster in sys\n        scatter(real.(Vortex.position.(cluster)),\n                imag.(Vortex.position.(cluster)),\n                c = Vortex.circulation.(cluster),\n                vmin = 0, vmax = 1, alpha = 0.7,\n                cmap = PyPlot.get_cmap(\"Reds\"))\n    end\n    colorbar(label=\"\\$\\\\Gamma\\$\")\n    axis(:scaled)\n    axis([-3,3,-3,3])\n    savefig(filename)\n    nothing\nendNow that we compute the velocities of a system of vortex elements, we can march the system forward in time to simulate its behavior. As an example, we will simulate of two clusters of vortex blobs merging.N = 200\nzs = Complex.(0.5randn(N), 0.5randn(N))\nΓs  = @. exp(-4abs2(zs))\ncluster₁ = Vortex.Blob.(zs + 1, Γs, 0.01)\ncluster₂ = Vortex.Blob.(zs - 1, Γs, 0.01)\n\nsys = (cluster₁, cluster₂)\nvels = allocate_velocity(sys)\nplot_system(sys, \"initial_clusters.svg\") # hidewarning: Warning\nFunctions for plotting vortex elements are still waiting for a couple more issues to be fixed on Plots.jl.  For now, we can use PyPlot directly as follows:using PyPlot\nfor cluster in sys\n    scatter(real.(Vortex.position.(cluster)),\n            imag.(Vortex.position.(cluster)),\n            c = Vortex.circulation.(cluster),\n            vmin = 0, vmax = 1, alpha = 0.7,\n            cmap = PyPlot.get_cmap(\"Reds\"))\nend\ncolorbar()\naxis(:scaled)\naxis([-3,3,-3,3])(Image: )Given an array or tuple of vortex elements and their velocities, we can compute their positions after some time interval with the advect!(x₊, x, ẋ, Δt) function, wherex₊ is where the new states are stored\nx is the current state\nΔt is the time interval\nẋ is the velocity.In our case, we will let x₊ and x both be set to sys:Δt = 0.01\nfor t in 0:Δt:1.0\n    reset_velocity!(vels, sys)\n    self_induce_velocity!(vels, sys)\n    advect!(sys, sys, vels, Δt)\nend\nplot_system(sys, \"final_clusters.svg\") # hide(Image: )"
},

{
    "location": "elements.html#",
    "page": "Vortex Elements",
    "title": "Vortex Elements",
    "category": "page",
    "text": ""
},

{
    "location": "elements.html#Vortex-Elements-1",
    "page": "Vortex Elements",
    "title": "Vortex Elements",
    "category": "section",
    "text": "DocTestSetup = quote\nusing VortexModel\nsrand(1)\nendThe library currently has four built-in vortex types:Vortex.Point\nVortex.Blob\nVortex.Sheet\nVortex.Plate (at the moment, there can only be one plate in the fluid at at time)Most functions in the library that act on vortex elements can take either a single vortex element, or a collection of elements. These collections can be represented as an array or a tuple. Arrays should be used when the elements are the same type, for example:julia> points = Vortex.Point.(rand(Complex128, 5), rand(5))\n5-element Array{VortexModel.Vortex.Points.Point,1}:\n Point Vortex: z = 0.236 + 0.347im, Γ = 0.556\n Point Vortex: z = 0.313 + 0.008im, Γ = 0.437\n Point Vortex: z = 0.489 + 0.211im, Γ = 0.425\n Point Vortex: z = 0.952 + 1.0im, Γ = 0.773\n Point Vortex: z = 0.252 + 0.987im, Γ = 0.281\n\njulia> Vortex.impulse(points)\n1.3362266530178137 - 1.2821936908564113im\n\njulia> blobs = [Vortex.Blob(rand(Complex128), rand(), 0.1) for i in 1:5]\n5-element Array{VortexModel.Vortex.Blobs.Blob,1}:\n Vortex Blob: z = 0.209 + 0.251im, Γ = 0.02, δ = 0.1\n Vortex Blob: z = 0.288 + 0.86im, Γ = 0.077, δ = 0.1\n Vortex Blob: z = 0.64 + 0.874im, Γ = 0.279, δ = 0.1\n Vortex Blob: z = 0.751 + 0.645im, Γ = 0.078, δ = 0.1\n Vortex Blob: z = 0.848 + 0.086im, Γ = 0.553, δ = 0.1\n\njulia> Vortex.impulse(blobs)\n0.41217890550975256 - 0.7325028967929701imKnowing that every element has the same type allows the compiler to perform more aggressive optimizations. Tuples are used when we want to mix and match different vortex types. For example:julia> sys = (points, blobs);\n\njulia> Vortex.impulse(sys)\n1.7484055585275664 - 2.0146965876493814imThis rest of this page documents the data types that represent these elements and some key functions that act on them. For more detailed examples, please refer to the Jupyter notebooks."
},

{
    "location": "elements.html#VortexModel.Vortex.Points.Point",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Points.Point",
    "category": "Type",
    "text": "Vortex.Point <: Vortex.PointSource\n\nAn immutable structure representing a point vortex\n\nFields\n\nz: position\nΓ: circulation\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Blobs.Blob",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Blobs.Blob",
    "category": "Type",
    "text": "Vortex.Blob <: Vortex.PointSource\n\nAn immutable structure representing a vortex blob\n\nFields\n\nz: position\nΓ: circulation\nδ: blob radius\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Sheets.Sheet",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Sheets.Sheet",
    "category": "Type",
    "text": "Vortex.Sheet <: Vortex.CompositeSource\n\nA vortex sheet represented by vortex blob control points\n\nFields\n\nblobs: the underlying array of vortex blobs\nΓs: the cumulated sum of circulation starting from the first control point\nδ: the blob radius of all the vortex blobs\n\nConstructors:\n\nSheet(zs, Γs, δ) where zs is an array of positions for the control points\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Plates.Plate",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Plates.Plate",
    "category": "Type",
    "text": "Vortex.Plate <: VortexCompositeSource\n\nAn infinitely thin, flat plate, represented as a bound vortex sheet\n\nFields\n\nL\nchord length\nc\ncentroid\nα\ncentroid velocity\nΓ\ntotal circulation\nN\nnumber of control points\nss\nnormalized positions (within [-1, 1]) of the control points\nzs\ncontrol point coordinates\nA\nChebyshev coefficients of the normal component of velocity induced along the plate by ambient vorticity\nC\nChebyshev coefficients of the velocity induced along the plate by ambient vorticity\nB₀\nzeroth Chebyshev coefficient associated with body motion\nB₁\nfirst Chebyshev coefficient associated with body motion\ndct!\nPreplanned DCT used to perform the discrete Chebyshev transform\n\nConstructors\n\nPlate(N, L, c, α)\n\n\n\n"
},

{
    "location": "elements.html#Built-in-Vortex-Types-1",
    "page": "Vortex Elements",
    "title": "Built-in Vortex Types",
    "category": "section",
    "text": "Vortex.Point\nVortex.Blob\nVortex.Sheet\nVortex.Plate"
},

{
    "location": "elements.html#VortexModel.Vortex.position",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.position",
    "category": "Function",
    "text": "Vortex.position(src::PointSource)\n\nReturns the complex position of a PointSource type vortex element This is a required method for all subtypes of PointSource.\n\nExample\n\njulia> point = Vortex.Point(1.0 + 0.0im, 1.0);\n\njulia> Vortex.position(point)\n1.0 + 0.0im\n\njulia> points = Vortex.Point.([1.0im, 2.0im], 1.0);\n\njulia> Vortex.position.(points)\n2-element Array{Complex{Float64},1}:\n 0.0+1.0im\n 0.0+2.0im\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.circulation",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.circulation",
    "category": "Function",
    "text": "Vortex.circulation(src)\n\nReturns the total circulation contained in src This is a required method for all vortex types.\n\nExample\n\njulia> points = Vortex.Point.([1.0im, 2.0im], [1.0, 2.0]);\n\njulia> Vortex.circulation(points[1])\n1.0\n\njulia> Vortex.circulation(points)\n3.0\n\njulia> Vortex.circulation.(points)\n2-element Array{Float64,1}:\n 1.0\n 2.0\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.impulse",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.impulse",
    "category": "Function",
    "text": "Vortex.impulse(src)\n\nReturn the aerodynamic impulse of src about (0,0):\n\nP = int boldsymbolx times boldsymbolomegamathrmdA\n\nThis is a required method for all vortex types.\n\nExample\n\njulia> sys = (Vortex.Point(1.0im, π), Vortex.Blob(1.0im, -π, 0.1));\n\njulia> Vortex.impulse(sys[1])\n3.141592653589793 + 0.0im\n\njulia> Vortex.impulse(sys)\n0.0 + 0.0im\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.advect",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.advect",
    "category": "Function",
    "text": "advect(src::PointSource, velocity::Complex128, Δt)\n\nReturn a new vortex element that represents src advected by velocity over Δt If this method is implemented by any type T <: PointSource, then an array of type AbstractArray{T} can be passed in the first two arguments of advect!.\n\nExample\n\njulia> point = Vortex.Point(1.0 + 0.0, 1.0);\n\njulia> advect(point, 1.0im, 1e-2)\nPoint Vortex: z = 1.0 + 0.01im, Γ = 1.0\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.advect!",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.advect!",
    "category": "Function",
    "text": "advect!(srcs₊, srcs₋, vels, Δt)\n\nMoves the elements in srcs₋ by their corresponding velocity in vels over the interval Δt and store the results in src₊ srcs₋ and srcs₊ can be either a array of vortex elements or a tuple.\n\nExample\n\njulia> points₋ = [Vortex.Point(x + 0im, 1.0) for x in 1:5];\n\njulia> points₊ = Vector{Vortex.Point}(5);\n\njulia> vels = [ y*im for y in 1.0:5 ];\n\njulia> advect!(points₊, points₋, vels, 1e-2)\n\njulia> points₊\n5-element Array{VortexModel.Vortex.Points.Point,1}:\n Point Vortex: z = 1.0 + 0.01im, Γ = 1.0\n Point Vortex: z = 2.0 + 0.02im, Γ = 1.0\n Point Vortex: z = 3.0 + 0.03im, Γ = 1.0\n Point Vortex: z = 4.0 + 0.04im, Γ = 1.0\n Point Vortex: z = 5.0 + 0.05im, Γ = 1.0\n\n\n\n"
},

{
    "location": "elements.html#Vortex-Properties-1",
    "page": "Vortex Elements",
    "title": "Vortex Properties",
    "category": "section",
    "text": "Vortex.position\nVortex.circulation\nVortex.impulse\nadvect\nadvect!"
},

{
    "location": "elements.html#VortexModel.Vortex.Sheets.truncate!",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Sheets.truncate!",
    "category": "Function",
    "text": "Vortex.Sheets.truncate!(sheet, n::Int)\n\nRemove segments 0:n from sheet, and return the circulation in those segments.\n\nExample\n\njulia> sheet = Vortex.Sheet(0:0.1:1, 0.0:10, 0.2)\nVortex Sheet: L ≈ 1.0, Γ = 10.0, δ = 0.2\n\njulia> Vortex.Sheets.truncate!(sheet, 5)\n4.0\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Sheets.remesh!",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Sheets.remesh!",
    "category": "Function",
    "text": "Vortex.Sheets.remesh!(sheet, zs, Γs)\n\nRedistribute the control points of the sheet to lie on zs with circulation Γs.\n\nExample\n\njulia> sheet = Vortex.Sheet(0:0.1:1, 0.0:10, 0.2)\nVortex Sheet: L ≈ 1.0, Γ = 10.0, δ = 0.2\n\njulia> Vortex.Sheets.remesh!(sheet, 0:0.2:2, 2sheet.Γs)\nVortex Sheet: L ≈ 2.0, Γ = 20.0, δ = 0.2\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Sheets.split!",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Sheets.split!",
    "category": "Function",
    "text": "Vortex.Sheets.split!(sheet, n::Int)\n\nRemove segments 0:n from sheet, and return those segments as a new sheet.\n\nExample\n\njulia> sheet = Vortex.Sheet(0:0.1:1, 0.0:10, 0.2)\nVortex Sheet: L ≈ 1.0, Γ = 10.0, δ = 0.2\n\njulia> sheet₋ = Vortex.Sheets.split!(sheet, 5)\nVortex Sheet: L ≈ 0.4, Γ = 4.0, δ = 0.2\n\njulia> sheet\nVortex Sheet: L ≈ 0.6, Γ = 6.0, δ = 0.2\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Sheets.filter!",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Sheets.filter!",
    "category": "Function",
    "text": "Vortex.Sheets.filter!(sheet, Δs, Δf)\n\nApply Fourier filtering to the sheet position and strengths.  The control points are redistributed to maintain a nominal point spacing of of Δs, and the filtering removes any length scales smaller than Δf.\n\n\n\n"
},

{
    "location": "elements.html#Methods-on-Vortex-Sheets-1",
    "page": "Vortex Elements",
    "title": "Methods on Vortex Sheets",
    "category": "section",
    "text": "Vortex.Sheets.truncate!\nVortex.Sheets.remesh!\nVortex.Sheets.split!\nVortex.Sheets.filter!"
},

{
    "location": "elements.html#VortexModel.Vortex.Plates.enforce_no_flow_through!",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Plates.enforce_no_flow_through!",
    "category": "Function",
    "text": "enforce_no_flow_through!(p::Plate, motion, elements)\n\nUpdate the plate, p, to enforce the no-flow-through condition given ambient vortex elements, elements, and while moving with kinematics specified by motion.\n\nExample\n\njulia> plate = Vortex.Plate(128, 2.0, 0.0, π/3)\nPlate: N = 128, L = 2.0, c = 0.0 + 0.0im, α = 60.0ᵒ\n       LESP = 0.0, TESP = 0.0\n\njulia> motion = allocate_velocity(plate); motion.ċ = 1.0;\n\njulia> point = Vortex.Point(0.0 + 2im, 1.0);\n\njulia> Vortex.enforce_no_flow_through!(plate, motion, point)\n\njulia> plate\nPlate: N = 128, L = 2.0, c = 0.0 + 0.0im, α = 60.0ᵒ\n       LESP = 1.27, TESP = -1.93\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Plates.vorticity_flux",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Plates.vorticity_flux",
    "category": "Function",
    "text": "vorticity_flux(p::Plate, v₁, v₂,\n               lesp = 0.0, tesp = 0.0,\n               ∂C₁ = Vector{Complex128}(plate.N),\n               ∂C₂ = Vector{Complex128}(plate.N))\n\nReturn strengths of new vortex elements that satisfies edge suction parameters. For a given edge, if the current suction parameter is less than the criticial suction parameter, then no vorticity is released.  If it is higher, however, vorticity will be released so that the suction parameter equals the critical value.\n\nArguments\n\np: the plate\nv₁, v₂: the vortex elements (with unit circulation) that the vorticity flux is going into\nlesp, tesp: the critical leading and trailing edge suction parameters we want to enforce.  By default, both parameters are set to 0.0 to enforce the Kutta condition on both edges.  We can disable vortex shedding from an edge by setting the its critical suction parameter to Inf\n\nReturns\n\nΓ₁, Γ₂: the strengths that the vortex element should have in order to satisfy the edge suction parameters\n∂C₁, ∂C₂: Chebyshev coefficients of the normal velocity induced by the vortex elements Instead of running enforce_bc! with the new vortex elements, we can use this matrix to directly update the Chebyshev coefficients associated with the bound vortex sheet without recomputing all the velocities.\n\nExample\n\nEnforcing the trailing edge Kutta condition with an point vortex at negative infinity:\n\njulia> plate = Vortex.Plate(128, 2.0, 0.0, π/6)\nPlate: N = 128, L = 2.0, c = 0.0 + 0.0im, α = 30.0ᵒ\n       LESP = 0.0, TESP = 0.0\n\njulia> motion = allocate_velocity(plate);\n\njulia> motion.ċ = 1.0;\n\njulia> Vortex.enforce_no_flow_through!(plate, motion, ())\n\njulia> point = Vortex.Point(-Inf, 1.0);\n\njulia> _, Γ, _, _ = Vortex.vorticity_flux(plate, (), point,  Inf);\n\njulia> Γ # should equal -πULsin(α) = -π\n-3.1415926535897927\n\n\n\n"
},

{
    "location": "elements.html#VortexModel.Vortex.Plates.vorticity_flux!",
    "page": "Vortex Elements",
    "title": "VortexModel.Vortex.Plates.vorticity_flux!",
    "category": "Function",
    "text": "vorticity_flux!(p::Plate, v₁, v₂,\n                lesp = 0.0, tesp = 0.0,\n                ∂C₁ = Vector{Complex128}(plate.N),\n                ∂C₂ = Vector{Complex128}(plate.N))\n\nIn-place version of vorticity_flux, except instead of just returning the possible changes in plate Chebyshev coefficients, we modify plate.C with those changes so that no-flow-through is enforced in the presence of v₁ and v₂ with strengths that satisfy the suction parameters.\n\n\n\n"
},

{
    "location": "elements.html#Methods-on-Plates-1",
    "page": "Vortex Elements",
    "title": "Methods on Plates",
    "category": "section",
    "text": "Vortex.Plates.enforce_no_flow_through!\nVortex.Plates.vorticity_flux\nVortex.Plates.vorticity_flux!"
},

{
    "location": "elements.html#Index-1",
    "page": "Vortex Elements",
    "title": "Index",
    "category": "section",
    "text": "Pages = [\"elements.md\"]"
},

{
    "location": "velocities.html#",
    "page": "Computing Velocities",
    "title": "Computing Velocities",
    "category": "page",
    "text": ""
},

{
    "location": "velocities.html#Computing-Velocities-1",
    "page": "Computing Velocities",
    "title": "Computing Velocities",
    "category": "section",
    "text": "Coming soon..."
},

{
    "location": "timemarching.html#",
    "page": "Time Marching",
    "title": "Time Marching",
    "category": "page",
    "text": ""
},

{
    "location": "timemarching.html#Time-Marching-1",
    "page": "Time Marching",
    "title": "Time Marching",
    "category": "section",
    "text": "Coming soon..."
},

]}