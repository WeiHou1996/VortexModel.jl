# Computing Velocities

```@meta
DocTestSetup = quote
using VortexModel
srand(1)
end
```

## Sources and Targets

Velocity computations in vortex models essentially boils down to pairwise interactions between sources and targets.
We may be interested in how a system of vortex elements induces velocity on at point, at multiple points, on other vortex elements, or on itself.

The three key functions for computing velocities are
- [`induce_velocity(target, source)`](@ref induce_velocity)
- [`induce_velocity!(velocity, target, source)`](@ref induce_velocity!)
- [`self_induce_velocity!(velocity, source)`](@ref self_induce_velocity!)
The [`!` suffix](https://docs.julialang.org/en/latest/manual/style-guide.html#Append-!-to-names-of-functions-that-modify-their-arguments-1) in the last two function signatures indicate that the `velocity` argument will be overwritten by the results of the computation.

Sources of velocity can be any one of:
- a single vortex element, e.g.
  ```jldoctest sources-targets
  julia> src = Vortex.Point(im, 1.0);

  julia> induce_velocity(0.0 + 0.0im, src)
  0.15915494309189535 - 0.0im
  ```
- an array of homogenous vortex types, e.g.
  ```jldoctest sources
  julia> srcs = Vortex.Point.([im, 1.0], 1.0);

  julia> induce_velocity(0.0 + 0.0im, srcs)
  0.15915494309189535 - 0.15915494309189535im
  ```
- a tuple of different vortex types, e.g.
  ```jldoctest sources
  julia> srcs₂ = Vortex.Point.([2im, 2.0], -2.0);

  julia> sys = (srcs, srcs₂);

  julia> induce_velocity(0.0 + 0.0im, sys)
  0.0 + 0.0im
  ```

In the examples above, the target was just complex number `0.0 + 0.0im`.
However we can also have

- an array of complex numbers, e.g.
  ```jldoctest sources-targets
  julia> targets = Complex128.(1:3);

  julia> induce_velocity(targets, src)
  3-element Array{Complex{Float64},1}:
   0.0795775+0.0795775im
    0.031831+0.063662im
   0.0159155+0.0477465im
  ```
- an array of vortex elements, e.g.
  ```jldoctest sources-targets
  julia> targets₂ = Vortex.Point.(im*(1.0:3), 1.0);

  julia> induce_velocity(targets₂, src)
  3-element Array{Complex{Float64},1}:
          0.0+0.0im
    -0.159155+0.0im
   -0.0795775+0.0im
  ```
- a tuple with any of the above, e.g.
  ```jldoctest sources-targets
  julia> targets₃ = Vortex.Point.(-3.0:-1, -1.0);

  julia> sys = (targets, (targets₂, targets₃));

  julia> induce_velocity(sys, src)
  (Complex{Float64}[0.0795775+0.0795775im, 0.031831+0.063662im, 0.0159155+0.0477465im], (Complex{Float64}[0.0+0.0im, -0.159155+0.0im, -0.0795775+0.0im], Complex{Float64}[0.0159155-0.0477465im, 0.031831-0.063662im, 0.0795775-0.0795775im]))
  ```

Since the structure of these targets can get complicated, e.g. nested tuples), the library also provides a set of functions for creating and resizing the `velocity` variable for in-place computations.
For example:
```jldoctest sources-targets
julia> vels = allocate_velocity(sys)
(Complex{Float64}[0.0+0.0im, 0.0+0.0im, 0.0+0.0im], (Complex{Float64}[0.0+0.0im, 0.0+0.0im, 0.0+0.0im], Complex{Float64}[0.0+0.0im, 0.0+0.0im, 0.0+0.0im]))

julia> induce_velocity!(vels, sys, src)
(Complex{Float64}[0.0795775+0.0795775im, 0.031831+0.063662im, 0.0159155+0.0477465im], (Complex{Float64}[0.0+0.0im, -0.159155+0.0im, -0.0795775+0.0im], Complex{Float64}[0.0159155-0.0477465im, 0.031831-0.063662im, 0.0795775-0.0795775im]))
```

The remaining sections of this page list the documentation for all the relevant methods for computing velocities.
More detailed examples that show these methods working together can be found in the [getting started guide](@ref getting-started) and the [Jupyter notebooks](https://github.com/darwindarak/VortexModel.jl/tree/master/examples).

## Methods

```@docs
allocate_velocity
reset_velocity!
induce_velocity
induce_velocity!
self_induce_velocity!
mutually_induce_velocity!
```

## Index

```@index
Pages = ["velocities.md"]
```
