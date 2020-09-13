# Spotlight
<svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 247.96 71.96"> <path fill="#9BD6CE" d="M62.97 8.05l4.56 38.92 38.74-7.13L76.1 1.81 62.97 8.05z"></path> <circle cx="71.02" cy="8.05" r="8.05" fill="#f1f2f2"></circle> <ellipse cx="88.62" cy="46.97" rx="21.09" ry="13.03" fill="#f1f2f2"></ellipse> <text transform="translate(0 59.17)" font-size="60" fill="#f1f2f2" font-family="Lato-Regular, Lato"> Sp </text> <text transform="translate(108.46 60.98)" font-size="60" fill="#f1f2f2" font-family="Lato-Regular, Lato"> tlight </text> </svg>

A low/no-overhead accurate in-BEAM web response time graph, which stores P50, P90 and P99 for your phoenix server. To do this, it makes use of `dog_sketch`, an implementation of the DDSketch algorithm and data structure.

For more information on the underlying data structure and algorithm that this project uses, see [here](https://github.com/moosecodebv/dog_sketch).
