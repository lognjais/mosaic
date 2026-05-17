/**
 * Atlas — personal multi-year transition plan for Jai.
 *
 * One source of truth. Edit this file to add/revise tasks and resources.
 * Tasks are atomic: every `verify` is a binary check.
 *
 * Stealth posture: capstone repos go public when shipped, but no marketing.
 * Apply via direct DMs + portal, not broadcast.
 *
 * Structure (continuous weekly arc, W0..W172):
 *   Year 0 (W0..W16, weekly cadence) — land first AI infra/inference role
 *   Year 1 (W17..W68,  4 × 13-wk quarters) — settle, math, first OSS PRs, reproduction
 *   Year 2 (W69..W120, 4 × 13-wk quarters) — bridge: OSS subsystem ownership, workshop paper, fork decision
 *   Year 3 (W121..W172, 4 × 13-wk quarters) — elite-lab applications + interview loops
 *
 * Two streams from Year 1+:
 *   systems (default) — inference engineer, ML compiler, training infra
 *   research          — research engineer fork (math-heavy; Year 4-6 evolution
 *                       from inside a lab, not a Year 3 destination)
 *
 * ──────────────────────────────────────────────────────────────────────
 * The decay model — how this curriculum stays current.
 * ──────────────────────────────────────────────────────────────────────
 *
 * Every resource carries a `halfLife`:
 *   durable — math, memory hierarchy, C++ memory model, roofline, attention
 *             primitive, compiler theory, paper-reading method. ~10y stable.
 *   medium  — concept-stable but specifics rotate (transformer variants,
 *             quant recipes, training playbooks). ~3-5y stable.
 *   fast    — VERIFY before action: specific frameworks, current SOTA papers,
 *             versioned APIs, current lab hiring guides. ~1-2y stable.
 *
 * Ephemeral material is intentional — you cannot ship a real artifact in
 * 'durable' alone. But the bedrock should outweigh the chase. See
 * BEDROCK_DOMAINS at the bottom of the file for the immutable spine.
 *
 * Three mechanisms keep this from rotting:
 *   1. Curriculum Review tasks at W16, Y1Q4, Y2Q4 — refresh ritual.
 *   2. Living Layer: continuous channels (Interconnects, GPU MODE, Import AI)
 *      that stay current by being read weekly, not by editing this file.
 *   3. Bedrock Anchoring: math + memory + compiler theory + paper-reading get
 *      front-of-line in Year 0; framework-specific work sits on top of bedrock.
 *
 * ──────────────────────────────────────────────────────────────────────
 * Brutal-honesty notes (from research):
 *   - Math rust is the #1 killer for senior SWEs at elite-lab loops.
 *     DeepMind quiz, OpenAI ML implementation, Anthropic CodeSignal — all
 *     filter on formal LinAlg/Calc/Prob, not intuitions.
 *   - Cold applications to OpenAI / Anthropic / DeepMind without referrals fail.
 *     Network deliberately starting Year 1, not Year 3.
 *   - OSS strategy is two-stage: Year 1 builds a portfolio of 5–10 quality PRs
 *     across vLLM / SGLang / Triton (50–200 LOC each), with at least one shipping
 *     a measurable perf improvement cited by maintainers. A 500+ LOC named feature
 *     as an outsider in Y1 is unrealistic — PR queue depth, codebase churn, and
 *     vendor-driven roadmaps make it fail silently. Year 2 then deepens into one
 *     project for subsystem ownership (the person maintainers tag in related
 *     issues). Vanity PR counting is still wrong — the Y1 bar is "≥1 cited
 *     improvement," not "as many PRs as possible."
 *   - Anthropic Bengaluru opened 2026 — biggest geographic wedge for India.
 *   - OpenAI Residency is the single best non-PhD entry to OpenAI.
 *   - Default systems track. Treat Research Engineer as Year 4-6 evolution
 *     from inside the lab, not Year 3 destination.
 */

export type Track = 'read' | 'build' | 'apply' | 'prep'
export type Stream = 'core' | 'systems' | 'research'
export type Cadence = 'week' | 'quarter'
export type HalfLife = 'durable' | 'medium' | 'fast'

export type ResourceKind =
  | 'paper'
  | 'book'
  | 'video'
  | 'course'
  | 'docs'
  | 'blog'
  | 'repo'
  | 'tool'
  | 'mosaic'

export type Resource = {
  kind: ResourceKind
  title: string
  url: string
  hours?: string
  why?: string
  tier?: 1 | 2 | 3
  halfLife?: HalfLife // default 'medium'; 'fast' surfaces a verify-before-use badge
}

export type Task = {
  id: string // stable; never rename
  track: Track
  stream?: Stream // default 'core'
  title: string
  body?: string
  verify: string
  hours?: string
  prereqs?: string[]
  resources?: Resource[]
}

export type Week = {
  number: number // sequential 0..28 (W0–W16, then Y1·Q1=17 … Y3·Q4=28)
  title: string
  goal: string
  tasks: Task[]
  reading?: Resource[] // optional supplementary; not tasks
}

export type Phase = {
  id: string
  title: string
  blurb: string
  year: 0 | 1 | 2 | 3
  cadence: Cadence
  weeks: Week[]
  artifact?: string
  context?: string // longer "why this phase" — shown in panel
  color: string // CSS color (var() expression) used by the spine + accents
}

/**
 * How many calendar weeks one Period (Week record) covers in the global spine.
 * Year 0 = 1 (true week). Year 1+ = 13 (a quarter).
 */
export function periodWeeks(cadence: Cadence): number {
  return cadence === 'week' ? 1 : 13
}

// ────────────────────────────────────────────────────────────────────────
// Resource library — referenced by id below to avoid duplication.
// Curated catalog of Tier-1 free/canonical resources for the path.
// ────────────────────────────────────────────────────────────────────────

const R = {
  // Math
  threeB1B_linalg: {
    kind: 'video',
    title: '3Blue1Brown — Essence of Linear Algebra',
    url: 'https://www.3blue1brown.com/topics/linear-algebra',
    hours: '3.5h',
    why: 'Geometric-intuition reset; binge-able in two sittings.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  threeB1B_calc: {
    kind: 'video',
    title: '3Blue1Brown — Essence of Calculus',
    url: 'https://www.3blue1brown.com/topics/calculus',
    hours: '3h',
    why: 'Calculus visual reset; pair with Matrix Calculus for backprop.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  strang_18065: {
    kind: 'course',
    title: 'MIT 18.065 — Matrix Methods in Data Analysis (Strang)',
    url: 'https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/',
    hours: '30h',
    why: 'SVD / PCA / least-squares as the spine — the math actually used in DL.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  matrix_calculus: {
    kind: 'paper',
    title: 'Parr & Howard — Matrix Calculus for Deep Learning',
    url: 'https://explained.ai/matrix-calculus/',
    hours: '4h',
    why: 'The exact subset of multivariable calc backprop needs.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  khan_multivar: {
    kind: 'course',
    title: 'Khan Academy — Multivariable Calculus',
    url: 'https://www.khanacademy.org/math/multivariable-calculus',
    hours: '20h',
    why: 'Gradient, Jacobian, Hessian — backprop prerequisites.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  stat110: {
    kind: 'course',
    title: 'Stat 110 — Joe Blitzstein (Harvard)',
    url: 'https://projects.iq.harvard.edu/stat110',
    hours: '40h',
    why: 'KL / MLE / MAP grounded properly. DeepMind quiz weight.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  boyd_optim: {
    kind: 'course',
    title: 'Stanford EE364A — Convex Optimization (Boyd)',
    url: 'https://web.stanford.edu/class/ee364a/',
    hours: '20h (skim 1-5)',
    why: 'Duality + gradient methods — the working subset for ML optim.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  ruder_grad: {
    kind: 'blog',
    title: 'Sebastian Ruder — Overview of Gradient Descent Algorithms',
    url: 'https://www.ruder.io/optimizing-gradient-descent/',
    hours: '1h',
    why: 'Adam/AdamW/Lion intuition in one sitting.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  distill_momentum: {
    kind: 'blog',
    title: 'Distill — Why Momentum Really Works',
    url: 'https://distill.pub/2017/momentum/',
    hours: '1h',
    why: 'Momentum demystified visually.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  mackay: {
    kind: 'book',
    title: 'MacKay — Information Theory, Inference, and Learning Algorithms',
    url: 'http://www.inference.org.uk/itila/book.html',
    hours: '15h (ch 1-6)',
    why: 'KL/entropy underpins cross-entropy, RLHF, distillation, KV-cache compression.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  olah_info: {
    kind: 'blog',
    title: 'Chris Olah — Visual Information Theory',
    url: 'https://colah.github.io/posts/2015-09-Visual-Information/',
    hours: '1h',
    why: '60-minute info-theory intuition primer.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // ────────────────────────────────────────────────────────────────────
  // C++ / OS / Computer Architecture — bedrock systems foundations
  // (the ground-up rebuild; durable across decades)
  // ────────────────────────────────────────────────────────────────────
  cppreference: {
    kind: 'docs',
    title: 'cppreference.com',
    url: 'https://en.cppreference.com/',
    why: 'Canonical C++ reference. Bookmark; reach for it constantly.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  effective_modern_cpp: {
    kind: 'book',
    title: 'Scott Meyers — Effective Modern C++',
    url: 'https://www.aristeia.com/books.html',
    hours: '20h',
    why: '42 specific items on modern (C++11/14) idioms. Move semantics, perfect forwarding, smart pointers.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  cpp_core_guidelines: {
    kind: 'docs',
    title: 'C++ Core Guidelines (Stroustrup + Sutter)',
    url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines',
    hours: '10h (skim)',
    why: 'Living standard for "how to write C++ that does not bite". Read, then re-read sections as needed.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  williams_concurrency: {
    kind: 'book',
    title: 'Anthony Williams — C++ Concurrency in Action (2nd ed)',
    url: 'https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition',
    hours: '30h',
    why: 'The canonical book on the C++ memory model, atomics, lock-free, and threading. Required for kernel-side work.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  sutter_atomic: {
    kind: 'video',
    title: 'Herb Sutter — atomic<> Weapons (CppCon)',
    url: 'https://www.youtube.com/watch?v=A8eCGOqgvH4',
    hours: '3h',
    why: 'Memory ordering rules made physical. acquire/release/relaxed without the textbook hand-waving.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  drepper_memory: {
    kind: 'paper',
    title: 'Ulrich Drepper — What Every Programmer Should Know About Memory',
    url: 'https://people.freebsd.org/~lstewart/articles/cpumemory.pdf',
    hours: '8h',
    why: 'The 2007 paper. Cache line sizes, NUMA, prefetching, false sharing — still 100% accurate today.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  ostep: {
    kind: 'book',
    title: 'OS Three Easy Pieces (Arpaci-Dusseau)',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    hours: '40h',
    why: 'Free OS textbook. Virtual memory, scheduling, concurrency, file systems. The page-table chapter is non-negotiable for ML systems.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  csapp: {
    kind: 'book',
    title: 'Bryant & O\'Hallaron — Computer Systems: A Programmer\'s Perspective',
    url: 'https://csapp.cs.cmu.edu/',
    hours: '60h',
    why: 'CMU 15-213. Caches, branch prediction, ILP, syscalls, signals, networking. The CS textbook every ML systems engineer should have read.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  agner_fog: {
    kind: 'docs',
    title: 'Agner Fog — Software Optimization Manuals',
    url: 'https://www.agner.org/optimize/',
    hours: '20h (reference)',
    why: 'Microarchitecture tables for every x86 generation; vectorization, instruction latencies, cache behavior. Reference grade.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  gregg_perf: {
    kind: 'book',
    title: 'Brendan Gregg — Systems Performance (2nd ed)',
    url: 'https://www.brendangregg.com/systems-performance-2nd-edition-book.html',
    hours: '30h',
    why: 'Linux performance methodology. USE / RED / TSA. perf, bcc, eBPF — the toolset that survives any framework.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  kr_c: {
    kind: 'book',
    title: 'Kernighan & Ritchie — The C Programming Language (2nd ed)',
    url: 'https://en.wikipedia.org/wiki/The_C_Programming_Language',
    hours: '15h',
    why: 'Pointers, arrays, strings, memory layout. Read once; the model applies to every systems language since.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  hennessy_patterson: {
    kind: 'book',
    title: 'Hennessy & Patterson — Computer Architecture: A Quantitative Approach',
    url: 'https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1',
    hours: '40h (skim)',
    why: 'The canonical CompArch text. Pipelining, ILP, memory hierarchy, multiprocessors, accelerators. Read for the discipline of quantitative arch reasoning.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  ostep_concurrency: {
    kind: 'book',
    title: 'OSTEP — Concurrency chapters (locks, condition vars, semaphores)',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/#book-chapters',
    hours: '8h',
    why: 'Concurrency primitives from the OS angle, before you map them to GPU sync.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  clrs: {
    kind: 'book',
    title: 'CLRS — Introduction to Algorithms',
    url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
    hours: '40h (reference)',
    why: 'Algorithms reference. Reach for chapters as needed; never read cover-to-cover.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // Programming + DL fundamentals
  karpathy_z2h: {
    kind: 'video',
    title: 'Karpathy — Neural Networks: Zero to Hero',
    url: 'https://karpathy.ai/zero-to-hero.html',
    hours: '25h',
    why: 'Pedagogy is durable; specific framework calls less so. Do all exercises.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  karpathy_llmc: {
    kind: 'repo',
    title: 'Karpathy — llm.c (LLM training in pure CUDA)',
    url: 'https://github.com/karpathy/llm.c',
    hours: '20h',
    why: 'Entire training loop in pure CUDA. Read as reference architecture.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  karpathy_nanogpt: {
    kind: 'repo',
    title: 'Karpathy — nanoGPT',
    url: 'https://github.com/karpathy/nanoGPT',
    hours: '8h',
    why: 'Reference GPT implementation. Read alongside zero-to-hero.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  raschka_llms: {
    kind: 'book',
    title: 'Raschka — Build a Large Language Model from Scratch',
    url: 'https://github.com/rasbt/LLMs-from-scratch',
    hours: '30h',
    why: 'Linear book-shaped path. Useful as a checklist of what you should already know cold.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  ed_yang_torch: {
    kind: 'blog',
    title: 'Edward Yang — PyTorch Internals',
    url: 'http://blog.ezyang.com/2019/05/pytorch-internals/',
    hours: '2h',
    why: 'Tensor strides, autograd, dispatcher. Foundations unchanged.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  ed_yang_podcast: {
    kind: 'video',
    title: 'PyTorch Dev Podcast (Edward Yang)',
    url: 'https://pytorch-dev-podcast.simplecast.com/',
    hours: 'ongoing',
    why: 'Each episode is a deep-dive into one component (autograd, dispatcher, dynamo, inductor).',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  torch_compile: {
    kind: 'docs',
    title: 'PyTorch torch.compile internals (Dynamo + Inductor)',
    url: 'https://pytorch.org/docs/stable/torch.compiler.html',
    hours: '5h',
    why: 'PT 2.x compile pipeline. Will rotate; the dataflow lowering pattern persists.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  fastai: {
    kind: 'course',
    title: 'fast.ai — Practical Deep Learning for Coders',
    url: 'https://course.fast.ai/',
    hours: '40h',
    why: 'Top-down: train SOTA in week 1, theory follows. (Replaces Andrew Ng 2011.)',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // GPU + Triton + CUTLASS
  pmpp_lectures: {
    kind: 'video',
    title: 'PMPP — Wen-mei Hwu lectures (YouTube)',
    url: 'https://www.youtube.com/playlist?list=PLRRuQYjFhpmubuwx-w8X964ofVkW1T8O4',
    hours: '20h',
    why: 'Free lecture companion to the canonical GPU programming book. Build the warp/SM/grid mental model from scratch.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  gpu_mode: {
    kind: 'video',
    title: 'GPU MODE — YouTube + Discord',
    url: 'https://www.youtube.com/@GPUMODE',
    hours: '50h',
    why: 'The community — Meta/Anthropic/NVIDIA folks teach GPU. Tier-0.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  gpu_mode_lectures_repo: {
    kind: 'repo',
    title: 'gpu-mode/lectures (notebooks + slides)',
    url: 'https://github.com/gpu-mode/lectures',
    why: 'Companion code for GPU MODE talks.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  gpu_puzzles: {
    kind: 'repo',
    title: 'Sasha Rush — GPU Puzzles',
    url: 'https://github.com/srush/GPU-Puzzles',
    hours: '6h',
    why: 'Best hands-on CUDA drilling that exists for free. Indexing-math + tile-shape reflexes.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  triton_puzzles: {
    kind: 'repo',
    title: 'Sasha Rush — Triton Puzzles',
    url: 'https://github.com/srush/Triton-Puzzles',
    hours: '6h',
    why: 'Triton equivalent of GPU Puzzles — required drilling.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  siboehm_matmul: {
    kind: 'blog',
    title: 'Simon Boehm — How to Optimize a CUDA Matmul Kernel',
    url: 'https://siboehm.com/articles/22/CUDA-MMM',
    hours: '3h',
    why: 'First-principles tiled-matmul walkthrough. Read once for the discipline of staged optimization.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  triton_docs: {
    kind: 'docs',
    title: 'Triton — Tutorials',
    url: 'https://triton-lang.org/main/getting-started/tutorials/index.html',
    why: 'Verify Modal pipeline; tutorials are basic. Use the matmul tutorial as a reference for autotune signature.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  triton_autotune: {
    kind: 'docs',
    title: 'Triton — Autotuner',
    url: 'https://triton-lang.org/main/python-api/generated/triton.autotune.html',
    why: '(BLOCK_M, BLOCK_N, BLOCK_K, num_warps, num_stages) — the search-space taxonomy.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  cutlass_repo: {
    kind: 'repo',
    title: 'NVIDIA/cutlass — CUTLASS 3.x with CuTe',
    url: 'https://github.com/NVIDIA/cutlass',
    hours: '15h',
    why: 'Standard for Hopper/Blackwell kernels. CuTe layout algebra is the durable concept.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  hopper_tma: {
    kind: 'docs',
    title: 'NVIDIA Hopper Tuning Guide — TMA + async pipelines',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/',
    hours: '2h',
    why: 'TMA + warp-specialization on H100. Concept stays; the SM90 specifics rotate to SM100+.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  hopper_whitepaper: {
    kind: 'paper',
    title: 'NVIDIA Hopper Architecture Whitepaper',
    url: 'https://resources.nvidia.com/en-us-tensor-core/nvidia-tensor-core-gpu-datasheet',
    hours: '4h',
    why: 'wgmma instruction family + tensor-core mode chart. Specific to SM90; refresh on new gens.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  blackwell_arch: {
    kind: 'paper',
    title: 'NVIDIA Blackwell (B100/B200) Architecture Brief',
    url: 'https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/',
    hours: '3h',
    why: 'SM100 / 5th-gen tensor cores / FP4. Refresh as Blackwell deployment matures.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  thunderkittens: {
    kind: 'repo',
    title: 'HazyResearch — ThunderKittens',
    url: 'https://github.com/HazyResearch/ThunderKittens',
    hours: '6h',
    why: 'Hopper-first kernel DSL. Read kernels/matmul as the reference.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  ncu_docs: {
    kind: 'docs',
    title: 'NVIDIA Nsight Compute Documentation',
    url: 'https://docs.nvidia.com/nsight-compute/',
    hours: '3h',
    why: 'Reference. Mental model of the metric tree is the durable part.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  pytorch_profiler: {
    kind: 'docs',
    title: 'PyTorch Profiler + Holistic Trace Analysis (HTA)',
    url: 'https://pytorch.org/docs/stable/profiler.html',
    hours: '3h',
    why: 'HTA is what Meta uses internally for training-trace analysis.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  horace_brrr: {
    kind: 'blog',
    title: 'Horace He — Making Deep Learning Go Brrrr From First Principles',
    url: 'https://horace.io/brrr_intro.html',
    hours: '2h',
    why: 'Compute / memory / overhead — the lens you reach for forever.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  chips_cheese: {
    kind: 'blog',
    title: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/',
    why: 'Independent microarchitecture deep-dives. Hopper/Blackwell/MI300/TPU.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  ultrascale: {
    kind: 'docs',
    title: 'HuggingFace — The Ultra-Scale Playbook',
    url: 'https://huggingface.co/spaces/nanotron/ultrascale-playbook',
    hours: '12h',
    why: 'Current canonical playbook for DP/TP/PP/FSDP/EP. The mathematics of parallelism is durable; the playbook URL is not.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  stas_book: {
    kind: 'book',
    title: 'Stas Bekman — ML Engineering Open Book',
    url: 'https://github.com/stas00/ml-engineering',
    hours: '15h',
    why: 'Practical FSDP / NCCL / training-at-scale debugging. Underrated gem.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  weng_train_large: {
    kind: 'blog',
    title: 'Lilian Weng — How to Train Really Large Models on Many GPUs',
    url: 'https://lilianweng.github.io/posts/2021-09-25-train-large/',
    hours: '2h',
    why: 'Cleanest mental model for the parallelism dimensions; the model is durable.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  // Advanced GPU / kernel additions (advanced systems baseline)
  cutlass_cute_paper: {
    kind: 'paper',
    title: 'CUTLASS CuTe layout algebra — primer',
    url: 'https://github.com/NVIDIA/cutlass/blob/main/media/docs/cute/00_quickstart.md',
    hours: '4h',
    why: 'Layout algebra is the durable abstraction; tile shapes / cluster shapes / kernel schedules sit on it.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  fa3_paper: {
    kind: 'paper',
    title: 'FlashAttention-3 (Shah et al.) — async + warp specialization',
    url: 'https://arxiv.org/abs/2407.08608',
    hours: '2h',
    why: 'TMA + wgmma + warp-specialized softmax/matmul interleaving on Hopper. Reference architecture.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  ptx_isa: {
    kind: 'docs',
    title: 'NVIDIA PTX ISA Reference',
    url: 'https://docs.nvidia.com/cuda/parallel-thread-execution/',
    hours: '3h',
    why: 'wgmma / mbarrier / cp.async.bulk family. Read once; reach for when ncu shows tensor-core gaps.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  nccl_internals: {
    kind: 'docs',
    title: 'NCCL — Collective Communications Library docs + design',
    url: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html',
    hours: '4h',
    why: 'Ring vs tree, reduction trees, NVLink+IB topology-aware bandwidth. The collectives are durable; the impl rotates.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  fp8_overview: {
    kind: 'paper',
    title: 'FP8 Formats for Deep Learning (NVIDIA / ARM / Intel 2022)',
    url: 'https://arxiv.org/abs/2209.05433',
    hours: '2h',
    why: 'E4M3 vs E5M2 trade-offs; underpins Hopper/Blackwell low-precision training & inference.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  mxfp4_paper: {
    kind: 'paper',
    title: 'OCP MX (Microscaling) Formats — MXFP4 / MXFP6 / MXFP8',
    url: 'https://arxiv.org/abs/2310.10537',
    hours: '2h',
    why: 'Block-level scaling. Foundation for Blackwell FP4 inference + post-Hopper quantization.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // Transformers + post-training
  attention_paper: {
    kind: 'paper',
    title: 'Attention Is All You Need (Vaswani et al.)',
    url: 'https://arxiv.org/abs/1706.03762',
    hours: '2h',
    why: 'The primitive that anchors everything; revisit in original notation.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  illustrated_transformer: {
    kind: 'blog',
    title: 'Jay Alammar — The Illustrated Transformer',
    url: 'https://jalammar.github.io/illustrated-transformer/',
    hours: '2h',
    why: 'Visual primer. Pair with the original paper.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  weng_transformer: {
    kind: 'blog',
    title: 'Lilian Weng — Transformer Family v2',
    url: 'https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/',
    hours: '3h',
    why: 'Survey of attention variants (RoPE, ALiBi, GQA, MQA, sliding-window). Variants will keep arriving.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  eleuther_math: {
    kind: 'blog',
    title: 'Eleuther AI — Transformer Math 101',
    url: 'https://blog.eleuther.ai/transformer-math/',
    hours: '1h',
    why: 'Memory / FLOPs / latency formulas that come up in interviews.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  annotated_transformer: {
    kind: 'blog',
    title: 'Sasha Rush — The Annotated Transformer',
    url: 'https://nlp.seas.harvard.edu/annotated-transformer/',
    hours: '4h',
    why: 'Reimplementing while reading. The methodology is durable even when the architecture rotates.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  flashattn_paper: {
    kind: 'paper',
    title: 'FlashAttention (Dao et al.)',
    url: 'https://arxiv.org/abs/2205.14135',
    hours: '2h',
    why: 'IO-aware attention. Origin for the tiling+online-softmax pattern.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  flashattn2_paper: {
    kind: 'paper',
    title: 'FlashAttention-2',
    url: 'https://arxiv.org/abs/2307.08691',
    hours: '1.5h',
    why: 'Better warp-level partitioning. Read alongside FA-3 for the evolution.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  rlhf_book: {
    kind: 'book',
    title: 'Nathan Lambert — RLHF Book',
    url: 'https://rlhfbook.com/',
    hours: '10h',
    why: 'Most current opinionated post-training resource (2025-26).',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  alignment_handbook: {
    kind: 'docs',
    title: 'HuggingFace Alignment Handbook + TRL docs',
    url: 'https://github.com/huggingface/alignment-handbook',
    hours: '10h',
    why: 'Reference impls of SFT, DPO, GRPO, KTO, ORPO.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  open_r1: {
    kind: 'repo',
    title: 'HuggingFace Open-R1 — DeepSeek-R1 / GRPO reproduction',
    url: 'https://github.com/huggingface/open-r1',
    hours: '6h',
    why: 'GRPO + reasoning models is the live frontier. Verify which method is current before reaching for this.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,

  // Quantization
  llm_int8: {
    kind: 'paper',
    title: 'LLM.int8() (Dettmers 2022)',
    url: 'https://arxiv.org/abs/2208.07339',
    hours: '2h',
    why: 'Outlier-channel observation that started modern LLM quant.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  gptq: {
    kind: 'paper',
    title: 'GPTQ (Frantar 2022)',
    url: 'https://arxiv.org/abs/2210.17323',
    hours: '2h',
    why: 'Hessian-based reconstruction; widely deployed.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  awq: {
    kind: 'paper',
    title: 'AWQ (Lin 2023)',
    url: 'https://arxiv.org/abs/2306.00978',
    hours: '1.5h',
    why: 'Salient-channel weighting — Han Lab.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  smoothquant: {
    kind: 'paper',
    title: 'SmoothQuant (Xiao 2022)',
    url: 'https://arxiv.org/abs/2211.10438',
    hours: '1.5h',
    why: 'Activation→weight migration; pairs with W4 quant.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  qlora: {
    kind: 'paper',
    title: 'QLoRA (Dettmers 2023)',
    url: 'https://arxiv.org/abs/2305.14314',
    hours: '1.5h',
    why: 'NF4 origin; underpins much of modern fine-tuning.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  bitsandbytes: {
    kind: 'repo',
    title: 'bitsandbytes — Linear4bit reference',
    url: 'https://github.com/bitsandbytes-foundation/bitsandbytes',
    hours: '3h',
    why: 'NF4 vs FP4 vs INT4 — read the source.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  hf_quant_docs: {
    kind: 'docs',
    title: 'Hugging Face — Quantization overview',
    url: 'https://huggingface.co/docs/transformers/main/en/quantization/overview',
    hours: '2h',
    why: 'Practical reference for what is currently deployed.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  grootendorst_quant: {
    kind: 'blog',
    title: 'Maarten Grootendorst — Visual Guide to Quantization',
    url: 'https://www.maartengrootendorst.com/blog/quantization/',
    hours: '2h',
    why: 'Best visual primer on GPTQ/AWQ/GGUF/bitsandbytes differences.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  han_6_5940: {
    kind: 'course',
    title: 'MIT 6.5940 — TinyML & Efficient DL Computing (Song Han)',
    url: 'https://hanlab.mit.edu/courses/2024-fall-65940',
    hours: '40h',
    why: 'Canonical academic treatment of quantization, pruning, distillation.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // Serving
  vllm_docs: {
    kind: 'docs',
    title: 'vLLM — Documentation + Design Docs',
    url: 'https://docs.vllm.ai/',
    hours: '10h',
    why: 'PagedAttention, continuous batching, prefix caching — read design not API.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  vllm_blog: {
    kind: 'blog',
    title: 'vLLM Blog',
    url: 'https://blog.vllm.ai/',
    why: 'Design posts on chunked prefill, disagg, prefix radix.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  vllm_repo: {
    kind: 'repo',
    title: 'vllm-project/vllm',
    url: 'https://github.com/vllm-project/vllm',
    why: 'The OSS project to go deep on for inference roles.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  sglang_docs: {
    kind: 'docs',
    title: 'SGLang — Documentation',
    url: 'https://docs.sglang.ai/',
    hours: '5h',
    why: 'RadixAttention, structured generation. Credible peer to vLLM in 2025.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  trt_llm: {
    kind: 'docs',
    title: 'NVIDIA TensorRT-LLM',
    url: 'https://nvidia.github.io/TensorRT-LLM/',
    hours: '8h',
    why: 'In-flight batching + FP8/FP4 inference on Hopper/Blackwell.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  eagle_paper: {
    kind: 'paper',
    title: 'EAGLE-3 (Li et al.) — speculative decoding',
    url: 'https://arxiv.org/abs/2503.01840',
    hours: '2h',
    why: 'Current SOTA tree-spec method. Verify before committing — speculative decoding moves fast.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  hao_ai: {
    kind: 'blog',
    title: 'Hao AI Lab Blog',
    url: 'https://hao-ai-lab.github.io/blogs/',
    why: 'Lookahead decoding, distserve, prefill/decode disaggregation.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  paged_attention: {
    kind: 'paper',
    title: 'Efficient Memory Management for LLM Serving (PagedAttention)',
    url: 'https://arxiv.org/abs/2309.06180',
    hours: '2h',
    why: 'The vLLM origin paper. The block-allocator concept is durable.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // Compilers
  mlir_toy: {
    kind: 'docs',
    title: 'MLIR — Toy Tutorial',
    url: 'https://mlir.llvm.org/docs/Tutorials/Toy/',
    hours: '8h',
    why: 'Official MLIR walkthrough; do every chapter. Concepts (dialects, lowering) are durable.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  mlir_beginners: {
    kind: 'repo',
    title: 'j2kun — MLIR for Beginners',
    url: 'https://github.com/j2kun/mlir-tutorial',
    hours: '7h',
    why: 'Friendliest entry point to MLIR that exists. Underrated gem.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  cs6120: {
    kind: 'course',
    title: 'Cornell CS 6120 — Advanced Compilers (Adrian Sampson)',
    url: 'https://www.cs.cornell.edu/courses/cs6120/',
    hours: '30h',
    why: 'Best free compilers course. SSA, dataflow, optimizations — durable theory.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  llvm_kaleidoscope: {
    kind: 'docs',
    title: 'LLVM Kaleidoscope Tutorial — frontend + IR + JIT',
    url: 'https://llvm.org/docs/tutorial/',
    hours: '10h',
    why: 'Build a small language end-to-end on LLVM IR. Best ground-up LLVM intro that exists.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  dragon_book: {
    kind: 'book',
    title: 'Aho/Lam/Sethi/Ullman — Compilers: Principles, Techniques, and Tools (Dragon Book)',
    url: 'https://www.pearson.com/en-us/subject-catalog/p/compilers-principles-techniques-and-tools/P200000003472',
    hours: '60h (reference)',
    why: 'Canonical compilers textbook. Read selectively for parsing, dataflow, code-gen chapters.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  tvm_docs: {
    kind: 'docs',
    title: 'Apache TVM Tutorials',
    url: 'https://tvm.apache.org/docs/',
    hours: '10h',
    why: 'Cleanest end-to-end ML compiler stack to study.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  mojo_docs: {
    kind: 'docs',
    title: 'Modular Mojo Manual',
    url: 'https://docs.modular.com/mojo/',
    hours: '8h',
    why: 'Track for compilers career relevance; not yet job-critical.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // Research methodology
  ng_paper_reading: {
    kind: 'video',
    title: 'Andrew Ng — How to Read Research Papers',
    url: 'https://www.youtube.com/watch?v=733m6qBH-jI',
    hours: '1h',
    why: '3-pass method; canonical 60-min primer.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  yannic: {
    kind: 'video',
    title: 'Yannic Kilcher — paper walkthroughs',
    url: 'https://www.youtube.com/@YannicKilcher',
    why: 'Watch his walkthroughs of papers you have already read; calibrates reading.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  lucidrains: {
    kind: 'repo',
    title: 'Phil Wang (lucidrains) — implementations',
    url: 'https://github.com/lucidrains',
    why: 'Reading lucidrains alongside papers is one of the best free educations.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  papers_with_code: {
    kind: 'tool',
    title: 'Papers with Code',
    url: 'https://paperswithcode.com/',
    why: 'Find papers with reference code; pick one to fully reproduce per quarter.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  schulman_research: {
    kind: 'blog',
    title: 'John Schulman — Opinionated Guide to ML Research',
    url: 'http://joschu.net/blog/opinionated-guide-ml-research.html',
    hours: '1h',
    why: 'Required reading for the research track.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  google_tuning: {
    kind: 'book',
    title: 'Google — Deep Learning Tuning Playbook',
    url: 'https://github.com/google-research/tuning_playbook',
    hours: '4h',
    why: 'Closest thing to a hyperparameter / experimentation rigor textbook.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  foerster_paper: {
    kind: 'docs',
    title: 'Jakob Foerster — How to ML Paper',
    url: 'https://docs.google.com/document/d/16R1E2ExKUCP5SlXWHr-KzbVDx9DBUclra-EbU8IB-iE/edit',
    hours: '1h',
    why: 'Brutally honest research methodology guide.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // Mech interp / alignment / RL
  nanda_interp: {
    kind: 'blog',
    title: 'Neel Nanda — TransformerLens Getting Started',
    url: 'https://www.neelnanda.io/mechanistic-interpretability/getting-started',
    hours: '8h',
    why: 'On-ramp to mech interp. Do the exercises.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  nanda_200: {
    kind: 'blog',
    title: 'Neel Nanda — 200 Concrete Open Problems',
    url: 'https://www.alignmentforum.org/posts/LbrPTJ4fmABEdEnLf/200-concrete-open-problems-in-mechanistic-interpretability',
    why: 'Pick one as a small research project.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  arena: {
    kind: 'course',
    title: 'ARENA — Alignment Research Engineer Accelerator',
    url: 'https://www.arena.education/',
    hours: '150h',
    why: 'Best free interp + alignment curriculum that exists.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  anthropic_interp: {
    kind: 'paper',
    title: 'Anthropic Transformer Circuits Thread (SAEs, Scaling Monosemanticity)',
    url: 'https://transformer-circuits.pub/',
    hours: '15h',
    why: 'Primary sources; read with TransformerLens open.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  aisf: {
    kind: 'course',
    title: 'AI Safety Fundamentals (BlueDot Impact)',
    url: 'https://aisafetyfundamentals.com/',
    hours: '30h',
    why: 'AGISF — the standard alignment intro. Anthropic ethics-round prep.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  spinning_up: {
    kind: 'book',
    title: 'OpenAI — Spinning Up in Deep RL',
    url: 'https://spinningup.openai.com/',
    hours: '25h',
    why: 'Best free intro to RL; PPO/SAC/TD3 from scratch.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  cs285: {
    kind: 'course',
    title: 'Berkeley CS 285 — Deep RL (Sergey Levine)',
    url: 'https://rail.eecs.berkeley.edu/deeprlcourse/',
    hours: '50h',
    why: 'Graduate RL course; latest 2024 iteration on YouTube.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  cleanrl: {
    kind: 'repo',
    title: 'CleanRL — single-file RL implementations',
    url: 'https://github.com/vwxyzjn/cleanrl',
    hours: '15h',
    why: 'Pairs with Spinning Up. Read each file end-to-end.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // Interview prep
  neetcode: {
    kind: 'tool',
    title: 'NeetCode 150 + NeetCode All',
    url: 'https://neetcode.io/',
    why: 'More than enough for AI infra/RE screens. Pattern-organized.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  leetgpu: {
    kind: 'tool',
    title: 'LeetGPU — CUDA whiteboard practice',
    url: 'https://leetgpu.com/',
    why: 'New 2025; closest thing to LeetCode for CUDA.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  chip_huyen_design: {
    kind: 'book',
    title: 'Chip Huyen — Designing ML Systems / ML Interviews',
    url: 'https://huyenchip.com/machine-learning-systems-design/toc.html',
    hours: '15h',
    why: 'Standard ML system design loop format.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  sundeep_interview: {
    kind: 'blog',
    title: 'Sundeep Teki — AI Research Engineer Interview Guide',
    url: 'https://www.sundeepteki.org/advice/the-ultimate-ai-research-engineer-interview-guide-cracking-openai-anthropic-google-deepmind-top-ai-labs',
    hours: '2h',
    why: 'Most current public guide to elite-lab loops (OpenAI/Anthropic/DeepMind).',
    tier: 1,
    halfLife: 'fast',
  } as Resource,

  // Stay-current — Living Layer (consumption channels; stay current by being read)
  interconnects: {
    kind: 'blog',
    title: 'Nathan Lambert — Interconnects',
    url: 'https://www.interconnects.ai/',
    why: 'Post-training and frontier-lab dynamics. Subscribe.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  import_ai: {
    kind: 'blog',
    title: 'Jack Clark — Import AI',
    url: 'https://importai.substack.com/',
    why: 'Anthropic co-founder weekly; high signal density.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  weng_blog: {
    kind: 'blog',
    title: 'Lilian Weng — Blog Archive',
    url: 'https://lilianweng.github.io/',
    why: 'Infrequent but every post is canonical.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  raschka_blog: {
    kind: 'blog',
    title: 'Sebastian Raschka — Ahead of AI',
    url: 'https://magazine.sebastianraschka.com/',
    why: 'Best monthly survey of what actually matters in research.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  dwarkesh: {
    kind: 'video',
    title: 'Dwarkesh Patel Podcast',
    url: 'https://www.dwarkeshpatel.com/',
    why: 'Long-form interviews with frontier-lab leadership.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // Mosaic — own content (you maintain it; treat as living)
  mosaic_foundations: {
    kind: 'mosaic',
    title: 'Mosaic — Foundations track',
    url: '/foundations',
    why: 'Your own deck. Calibration check, not primary read.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_ml_exec: {
    kind: 'mosaic',
    title: 'Mosaic — ML Execution',
    url: '/ml-execution',
    why: 'GPU fundamentals, tensors-in-memory, quantization.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_quant: {
    kind: 'mosaic',
    title: 'Mosaic — Quantization',
    url: '/ml-execution/quantization',
    why: 'Your int4-and-awq, mxfp4-nvfp4, rotation-quant lessons.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_compilers: {
    kind: 'mosaic',
    title: 'Mosaic — Compilers',
    url: '/compilers',
    why: 'MLIR/LLVM-IR/lowering/passes + Triton/CUTLASS/ThunderKittens lessons.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_kernels: {
    kind: 'mosaic',
    title: 'Mosaic — Kernels (Triton, CUTLASS, TK)',
    url: '/compilers/kernels',
    why: 'The exact 3-DSL surface Capstone 2 covers.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_attention: {
    kind: 'mosaic',
    title: 'Mosaic — Attention',
    url: '/llm-architecture/attention',
    why: 'MHA, GQA-MQA-MLA, RoPE-YaRN, FlashAttn-3.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_kv: {
    kind: 'mosaic',
    title: 'Mosaic — KV Cache',
    url: '/llm-architecture/kv-cache',
    why: 'Paged-attention, prefix-radix, disaggregated.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_inference: {
    kind: 'mosaic',
    title: 'Mosaic — Inference Time',
    url: '/llm-architecture/inference-time',
    why: 'Sampling, chunked-prefill, spec-decoding.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_serve: {
    kind: 'mosaic',
    title: 'Mosaic — Serving (vLLM/SGLang)',
    url: '/applied/serve',
    why: 'vllm-sglang, cost-latency, observability, on-device.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_training: {
    kind: 'mosaic',
    title: 'Mosaic — Training',
    url: '/training',
    why: 'Distributed (DP/TP/PP/FSDP), optimization, post-training.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  mosaic_post_training: {
    kind: 'mosaic',
    title: 'Mosaic — Post-Training',
    url: '/training/post-training',
    why: 'SFT/DPO/GRPO/KTO/RLHF — pair with Lambert RLHF book.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,

  // Production serving + observability (added: prod-proxy bedrock)
  modal_serve_docs: {
    kind: 'docs',
    title: 'Modal — Web endpoints + GPU serving',
    url: 'https://modal.com/docs/guide/webhooks',
    hours: '3h',
    why: 'Cheapest path to a real serving artifact: HTTPS endpoint, autoscale, GPU pinning. Verify before relying on specific APIs.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  distserve_paper: {
    kind: 'paper',
    title: 'DistServe — Disaggregating Prefill and Decoding (Zhong et al. 2024)',
    url: 'https://arxiv.org/abs/2401.09670',
    hours: '2h',
    why: 'Prefill/decode disagg is the modern serving design pattern; interview-table-stakes by 2026.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  sre_postmortem: {
    kind: 'book',
    title: 'Google SRE Book — Postmortems + ch.4 Service Level Objectives',
    url: 'https://sre.google/sre-book/postmortem-culture/',
    hours: '3h',
    why: 'Blameless postmortem template + SLI/SLO discipline. Inference postmortems borrow this format.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  observability_otel: {
    kind: 'docs',
    title: 'OpenTelemetry + Prometheus/Grafana — getting started',
    url: 'https://opentelemetry.io/docs/getting-started/',
    hours: '2h',
    why: 'Minimal stack for p50/p99 dashboards. Specifics rotate; the trace/metric/log triad is durable.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  ring_allreduce: {
    kind: 'blog',
    title: 'Bringing HPC Techniques to Deep Learning — ring-allreduce (Baidu)',
    url: 'https://andrew.gibiansky.com/blog/machine-learning/baidu-allreduce/',
    hours: '1.5h',
    why: 'Cleanest derivation of ring-allreduce bandwidth-optimality. Foundation for every NCCL question you will get.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
}

// ────────────────────────────────────────────────────────────────────────
// PATH — phases × periods × tasks
// ────────────────────────────────────────────────────────────────────────

export const PATH: Phase[] = [
  // ════════════════════════════════════════════════════════════════════
  // YEAR 0 — 16-week transition sprint
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'phase-0',
    title: 'Phase 0 — Setup',
    blurb: 'Compute working, repos seeded, baseline calibrated. Five days, no more.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'transition-tracker repo + working Modal + Lambda fallback',
    context:
      'No content yet — just rails. Five days. If setup spills past the week, something is wrong: rip out the friction (different cloud, different account, simpler stack) before starting Phase 1.',
    weeks: [
      {
        number: 0,
        title: 'Setup',
        goal: 'Cloud GPU compute working (Modal primary, Lambda backup). Tracker repo created. No content yet — just the rails.',
        tasks: [
          {
            id: 'w0-r1',
            track: 'read',
            title: 'Skim Mosaic foundations track',
            body: 'Read at 2× speed. Mark anything you cannot summarize back.',
            verify: 'Notes file lists 5+ fuzzy concepts to revisit',
            hours: '1h',
            resources: [R.mosaic_foundations],
          },
          {
            id: 'w0-r2',
            track: 'read',
            title: 'PMPP ch.1 — intro',
            body: 'Why GPUs beat CPUs for matmul. Mental model only.',
            verify: 'Can explain SIMT vs SIMD in your own words',
            hours: '1h',
            resources: [R.pmpp_lectures],
          },
          {
            id: 'w0-b1',
            track: 'build',
            title: 'Modal account + first H100 job',
            body: 'Sign up Modal. Spin a job that runs `nvidia-smi` on H100.',
            verify: '`modal run` prints H100 in nvidia-smi output',
            hours: '1h',
          },
          {
            id: 'w0-b2',
            track: 'build',
            title: 'Lambda Cloud as backup',
            body: 'Account only — you only pay if you provision. Fallback for sustained runs.',
            verify: 'Account active, billing card on file',
            hours: '15m',
          },
          {
            id: 'w0-b3',
            track: 'build',
            title: 'transition-tracker private repo',
            body: 'GitHub repo. README with the 16-week skeleton. One issue per phase.',
            verify: 'Repo URL exists, 6 issues opened',
            hours: '45m',
          },
          {
            id: 'w0-a1',
            track: 'apply',
            title: 'LinkedIn headline update',
            body: '"Senior SWE → AI Systems / Inference Engineer". Just hygiene; no announcement post.',
            verify: 'Live on profile',
            hours: '15m',
          },
          {
            id: 'w0-p1',
            track: 'prep',
            title: 'Calendar block: 30m × 4/wk leetcode',
            body: 'Recurring blocks starting Week 4. Without the block, it does not happen.',
            verify: 'Recurring event on calendar',
            hours: '15m',
            resources: [R.neetcode],
          },
          {
            id: 'w0-p2',
            track: 'prep',
            title: 'Bedrock reading queue — calendar a 2h/wk durable-foundations slot',
            body:
              'The Bedrock layer (math + C++ memory + OS + arch + compilers + paper-reading) is not Year-0 deliverable but ground-up insurance. Schedule a recurring 2h/wk block dedicated only to Bedrock reading; this carries through Year 0–3 untouched.',
            verify: 'Recurring 2h/wk Bedrock block on calendar',
            hours: '15m',
          },
          {
            id: 'w0-p3',
            track: 'prep',
            title: 'H100 hardware-numbers cheatsheet — first bedrock anchor',
            body:
              'Read the Hopper whitepaper sections on peak fp16/bf16 Tensor Core TFLOPs/s, HBM3 bandwidth, L2 size, SMEM/SM, registers/SM, wgmma instruction shapes. Write a one-page reference. You will reach for these numbers in every roofline argument from now on — the Capstone 1 ROOFLINE.md (W6) cannot be written without them.',
            verify:
              'docs/h100-numbers.md committed to transition-tracker; wgmma fp16 mma shape (m64nNk16) and ridge-point AI (~295 fp16 FLOPs/byte) written from memory',
            hours: '1.5h',
            resources: [R.hopper_whitepaper, R.hopper_tma],
          },
        ],
        reading: [R.drepper_memory, R.ostep, R.csapp, R.cppreference, R.horace_brrr],
      },
    ],
  },

  {
    id: 'phase-1',
    title: 'Phase 1 — Foundations',
    blurb: 'GPU mental model + first kernels. Two weeks, then move on — refresh math as you hit walls.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'gpu-warmup private repo with 3 working Triton kernels',
    context:
      'Math-rusty senior SWE bias: do not over-invest in math here. Get the geometric intuition (3B1B), the GPU memory model (PMPP/GPU MODE), and one working kernel. Backprop derivation can wait until Year 1 Q1 — for the 16-week sprint, kernels are the bridge artifact, not math depth.',
    weeks: [
      {
        number: 1,
        title: 'Math + GPU model',
        goal: 'Linear algebra refreshed enough to read FlashAttention. GPU memory hierarchy clear.',
        tasks: [
          {
            id: 'w1-r1',
            track: 'read',
            title: '3blue1brown LinAlg ep 1–7',
            verify: 'Notes file: one-line takeaway per episode',
            hours: '2h',
            resources: [R.threeB1B_linalg],
          },
          {
            id: 'w1-r2',
            track: 'read',
            title: 'PMPP ch.2–3 (architecture, threads)',
            verify: 'Can sketch warp/SM/grid hierarchy from memory',
            hours: '2h',
            resources: [R.pmpp_lectures],
          },
          {
            id: 'w1-r3',
            track: 'read',
            title: 'GPU MODE lectures 1 + 2 — memory hierarchy mapped to ML',
            body:
              'Intro + memory hierarchy. YouTube + companion notebooks. Goal: by end of week you can sketch the H100 bandwidth pyramid (HBM → L2 → SMEM → registers) with rough numbers and explain which level each Triton load/store pattern hits.',
            verify:
              'Notes covering global / shared / register tradeoffs PLUS a hand-drawn H100 bandwidth pyramid with numbers',
            hours: '1.5h',
            resources: [R.gpu_mode, R.gpu_mode_lectures_repo],
          },
          {
            id: 'w1-r4',
            track: 'read',
            title: 'Tensor Core shape constraints — Hopper Tuning Guide',
            body:
              'The wgmma instruction family + tensor-core mode chart: m64nNk16 for fp16/bf16, m64nNk32 for fp8 on H100. Kernels whose tile sizes do not match these shapes silently fall back to CUDA cores and run 8–16× slower. This is the single most-violated bedrock fact among self-taught GPU programmers.',
            verify:
              'Cheatsheet in notes: TC mode chart for fp16 / bf16 / fp8; one-paragraph explanation of why 64×N×16 not 32×N×16',
            hours: '1.5h',
            resources: [R.hopper_tma, R.hopper_whitepaper],
          },
          {
            id: 'w1-b1',
            track: 'build',
            title: 'Mosaic foundations linear-algebra cluster',
            body: 'Read the 4 lessons. Mark cheatsheet entries complete.',
            verify: 'Cheatsheet shows complete',
            hours: '1h',
            resources: [R.mosaic_foundations],
          },
          {
            id: 'w1-b2',
            track: 'build',
            title: 'Triton vector add on Modal H100',
            body: 'Official Triton tutorial. Run on Modal.',
            verify: 'Matches torch.add for N=1M fp32, 1e-5 atol',
            hours: '1h',
            resources: [R.triton_docs],
          },
          {
            id: 'w1-p1',
            track: 'prep',
            title: '3blue1brown LinAlg ep 8–14',
            verify: 'Notes for each episode',
            hours: '2h',
            resources: [R.threeB1B_linalg],
          },
        ],
        reading: [R.siboehm_matmul, R.horace_brrr, R.ostep, R.cppreference, R.kr_c],
      },
      {
        number: 2,
        title: 'First Triton kernels',
        goal: 'Three kernels working on H100. Within 80% of cuBLAS for matmul. gpu-warmup repo seeded.',
        tasks: [
          {
            id: 'w2-r1',
            track: 'read',
            title: 'Attention is All You Need (1st pass)',
            body: 'Architecture only. Skip the math derivations for now.',
            verify: '1-page summary in notes',
            hours: '2h',
            resources: [R.attention_paper, R.illustrated_transformer],
          },
          {
            id: 'w2-r2',
            track: 'read',
            title: 'PMPP ch.4–6 (memory, perf, divergence)',
            verify: 'Notes on bank conflicts + warp divergence',
            hours: '2h',
            resources: [R.pmpp_lectures],
          },
          {
            id: 'w2-r3',
            track: 'read',
            title: 'GPU MODE lectures 3 + 4',
            verify: 'Notes saved',
            hours: '1.5h',
            resources: [R.gpu_mode],
          },
          {
            id: 'w2-r4',
            track: 'read',
            title: 'Horace He — brrrr from first principles (first pass)',
            body:
              'The three regimes (compute-bound / memory-bound / overhead-bound) and how to tell which one a kernel is in. This is the lens you will reach for forever; the Capstone 1 ROOFLINE.md is fundamentally an applied version of this essay.',
            verify:
              'Notes: write the decision tree for "which regime is this op in?" from memory at the end of W2',
            hours: '1.5h',
            resources: [R.horace_brrr],
          },
          {
            id: 'w2-p3',
            track: 'prep',
            title: 'Roofline prediction drill — predict, then verify your matmul',
            body:
              'For your W2 Triton matmul (1024 fp16): predict the regime + expected % of peak BEFORE timing it. Compute arithmetic intensity, compare to ridge point, write down the prediction. Then run the bench and see how close you got. The discipline matters more than the answer.',
            verify:
              'docs/w2-prediction.md with predicted regime + predicted TFLOPs/s, then measured TFLOPs/s, then a 1-paragraph gap explanation',
            hours: '1h',
            prereqs: ['w2-b3'],
            resources: [R.horace_brrr, R.hopper_whitepaper],
          },
          {
            id: 'w2-b1',
            track: 'build',
            title: 'Mosaic ml-execution skim',
            body: 'Note any TL;DRs you cannot explain back.',
            verify: 'Fuzzy-concepts list',
            hours: '1.5h',
            resources: [R.mosaic_ml_exec],
          },
          {
            id: 'w2-b2',
            track: 'build',
            title: 'Triton fused softmax',
            body: 'Official tutorial. Run on Modal.',
            verify: 'Matches torch.softmax atol 1e-3 on 32×4096 fp16',
            hours: '1.5h',
            prereqs: ['w1-b2'],
            resources: [R.triton_docs],
          },
          {
            id: 'w2-b3',
            track: 'build',
            title: 'Triton matmul (1024 fp16)',
            body: 'cuda.synchronize before timing. 50 warmup + 50 timed runs.',
            verify: '≥80% of torch.matmul TFLOPs/s on H100',
            hours: '3h',
            prereqs: ['w2-b2'],
            resources: [R.triton_docs, R.siboehm_matmul],
          },
          {
            id: 'w2-b4',
            track: 'build',
            title: 'Push gpu-warmup repo',
            body: 'Three kernels + 1-line README per. Private OK.',
            verify: 'Repo URL exists',
            hours: '30m',
            prereqs: ['w2-b3'],
          },
          {
            id: 'w2-p1',
            track: 'prep',
            title: '3blue1brown Calculus ep 1–4',
            verify: 'Notes for each',
            hours: '1.5h',
            resources: [R.threeB1B_calc],
          },
          {
            id: 'w2-p2',
            track: 'prep',
            title: 'Ring-allreduce primer (Baidu)',
            body:
              'One read. Bandwidth-optimality derivation is durable; you will reach for it in every distributed-training interview.',
            verify: 'One-page notes: bandwidth = 2(N-1)/N × buffer / link_bw',
            hours: '1.5h',
            resources: [R.ring_allreduce, R.nccl_internals],
          },
        ],
        reading: [
          R.gpu_puzzles,
          R.triton_puzzles,
          R.eleuther_math,
          R.csapp,
          R.williams_concurrency,
          R.drepper_memory,
        ],
      },
    ],
  },

  {
    id: 'phase-2',
    title: 'Phase 2 — Capstone 1 · Fused Triton Kernel + Roofline Analysis',
    blurb:
      'The signal artifact for inference roles. A custom fused RMSNorm + Matmul Triton kernel, benchmarked vs torch.compile with Nsight Compute traces, paired with a comprehensive Roofline Analysis writeup that predicts the bottleneck before profiling. Five weeks.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact:
      'fused-rmsnorm-mm public repo: Triton fused RMSNorm+Matmul kernel + bench harness vs torch eager / torch.compile + saved NCU reports + ROOFLINE.md (predict bound from arithmetic intensity, verify against NCU, explain the gap)',
    context:
      'This is the resume artifact, hardened against the "DevOps tutorial in costume" critique. The previous q4-llama + Modal + Grafana + mock-postmortem plan was indistinguishable from 200 other Modal tutorials this year and signalled deployment, not engineering. The new artifact answers a different question: can you reason about hardware, predict where a kernel binds (compute / HBM / SMEM / overhead), and verify it with NCU? That is what an inference team actually buys. Ship line: a fused kernel that hits Tensor Cores and is correct atol 1e-3 vs torch reference + a 3-axis benchmark sweep (batch × hidden × dtype) + NCU reports for three representative shapes + a written ROOFLINE.md where you predict the bound BEFORE profiling and explain every gap. The ROOFLINE writeup is half the value — recruiters skim READMEs, but engineers read roofline analyses, and "I predicted memory-bound at ridge-point/8 and NCU confirmed 71% achieved bandwidth" is what separates kernel writers from kernel readers.',
    weeks: [
      {
        number: 3,
        title: 'Read & shape — Tensor Cores, memory hierarchy, roofline',
        goal:
          'H100 roofline numbers memorized. Tensor Core MMA shape constraints internalized. Fused-op design doc written with predicted arithmetic intensity per shape. Skeleton repo created.',
        tasks: [
          {
            id: 'w3-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W3 Capstone 1',
            body:
              'Can you do these cold? (Verifies that W1-W2 math + GPU model landed)\n' +
              '  • H100 bandwidth pyramid numbers (HBM3, L2, SMEM, regs)\n' +
              '  • Tensor Core shape constraints (wgmma; why m64nNk16 not m32nNk16)\n' +
              '  • Roofline regime prediction from a (shape, dtype, hardware) triple\n' +
              '  • Triton vector-add ran cleanly on Modal H100 in W1\n' +
              'If any feel fuzzy, re-skim the resource below before reading r1.',
            verify: 'Quick self-check; remediation started if any reflex rating <3',
            hours: '15m check + remediation in flight',
            resources: [R.horace_brrr, R.hopper_whitepaper, R.gpu_mode],
          },
          {
            id: 'w3-r1',
            track: 'read',
            title: 'Horace He — Making DL Go Brrrr (deep re-read)',
            body:
              'The three regimes (compute / memory / overhead) and how to tell which one you are in. This is the lens for the entire capstone.',
            verify: 'Notes: write the decision tree for "which regime is this op in?" from memory',
            hours: '2h',
            resources: [R.horace_brrr],
          },
          {
            id: 'w3-r2',
            track: 'read',
            title: 'Hopper Tuning Guide — wgmma + TMA + async pipelines',
            body:
              'Tensor-core mode chart + wgmma instruction family. The shape constraints (e.g., wgmma m64nNk16 for fp16) are the hard floor — kernels that miss them are 8–16× slower.',
            verify:
              'Cheatsheet: write the MMA shape table for fp16 / bf16 / fp8 on H100 from memory; explain why 64×N×16 not 32×N×16',
            hours: '2h',
            resources: [R.hopper_tma, R.hopper_whitepaper],
          },
          {
            id: 'w3-r3',
            track: 'read',
            title: 'PMPP ch.4–6 — memory hierarchy + tiling + bank conflicts',
            verify:
              'Notes: write the bandwidth pyramid for H100 — HBM3 (3.35 TB/s) → L2 (50 MB) → SMEM (228 KB/SM) → registers — with line/bank sizes',
            hours: '2.5h',
            resources: [R.pmpp_lectures],
          },
          {
            id: 'w3-r4',
            track: 'read',
            title: 'Simon Boehm — How to Optimize a CUDA Matmul (staged optimization)',
            body:
              'Read once for the discipline. The staging sequence (naive → SMEM tiling → register tiling → vectorize) is the canonical mental model for hitting peak.',
            verify: '1-page notes: name the bottleneck each stage removed',
            hours: '2h',
            resources: [R.siboehm_matmul],
          },
          {
            id: 'w3-r5',
            track: 'read',
            title: 'Why fuse RMSNorm into the next matmul?',
            body:
              'Read 1–2 references on op fusion (Triton matmul tutorial epilogue, fused-bias-act blogs). The point: RMSNorm produces an activation that is immediately consumed by a matmul; fusing eliminates one global-memory roundtrip — which matters precisely when the workload is HBM-bandwidth-bound.',
            verify:
              'Notes: predict the regimes (batch / hidden) where fusion helps most vs least, with an arithmetic-intensity argument',
            hours: '1.5h',
            resources: [R.triton_docs, R.gpu_mode],
          },
          {
            id: 'w3-b1',
            track: 'build',
            title: 'H100 roofline cheatsheet (from memory)',
            body:
              'Write a single-page reference: peak fp16/bf16 TC TFLOPs/s, peak fp32 (no TC), HBM3 bandwidth, L2 bandwidth, ridge-point arithmetic intensity, SMEM/SM, registers/SM, max active warps. From memory, then verify against the whitepaper.',
            verify: 'docs/roofline-h100.md committed; numbers within 5% of whitepaper',
            hours: '1h',
            resources: [R.hopper_whitepaper],
          },
          {
            id: 'w3-b2',
            track: 'build',
            title: 'Capstone 1 design doc — fused RMSNorm+Matmul',
            body:
              '1–2 pages. Sections: op definition (math), shapes to sweep (batch ∈ {1, 8, 32, 128} × hidden ∈ {2048, 4096, 8192} × dtype ∈ {fp16, bf16}), expected regime per shape (with arithmetic-intensity numbers), tile-size search space, NCU metrics to capture, success criteria (correctness atol, % of cuBLAS, roofline % of peak), and the question the ROOFLINE writeup will answer.',
            verify: 'DESIGN.md committed; predicted regime per shape with AI numbers',
            hours: '2.5h',
          },
          {
            id: 'w3-b3',
            track: 'build',
            title: 'Create fused-rmsnorm-mm private repo',
            body: 'Skeleton: README, kernels/, bench/, ncu/, tests/, ROOFLINE.md placeholder.',
            verify: 'Repo URL exists; CI placeholder runs',
            hours: '30m',
          },
          {
            id: 'w3-p1',
            track: 'prep',
            title: '3blue1brown Calc ep 5–10',
            verify: 'Notes',
            hours: '1.5h',
            resources: [R.threeB1B_calc],
          },
          {
            id: 'w3-p2',
            track: 'prep',
            title: 'NeetCode arrays/hashing — 5 problems',
            verify: '5 accepted on LeetCode',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.gpu_mode_lectures_repo, R.cutlass_cute_paper, R.chips_cheese],
      },
      {
        number: 4,
        title: 'Implement fused RMSNorm + Matmul',
        goal:
          'Standalone Triton RMSNorm and matmul kernels working and correct. Fused single-kernel version produces identical output to torch reference (atol 1e-3) and demonstrably hits Tensor Cores in NCU.',
        tasks: [
          {
            id: 'w4-r1',
            track: 'read',
            title: 'Triton matmul tutorial + autotune signature',
            body:
              'The official tutorial is the reference for (BLOCK_M, BLOCK_N, BLOCK_K, num_warps, num_stages). The epilogue pattern is what you generalize for fusion.',
            verify: 'Notes: write the autotune key and explain why each axis is tuned',
            hours: '1.5h',
            resources: [R.triton_docs, R.triton_autotune],
          },
          {
            id: 'w4-r2',
            track: 'read',
            title: 'GPU MODE lectures on Triton + matmul',
            verify: 'Notes saved on tile-size selection + load-store patterns',
            hours: '1.5h',
            resources: [R.gpu_mode],
          },
          {
            id: 'w4-b1',
            track: 'build',
            title: 'Standalone Triton RMSNorm kernel',
            body:
              'Block-level row reduction: mean-of-squares → rsqrt → scale by gamma. fp16/bf16 input, fp32 reduction. One row per block-program.',
            verify: 'Matches torch RMSNorm atol 1e-3 on (B=32, H=4096) fp16; 50-warmup + 50-timed bench logged',
            hours: '3h',
            resources: [R.triton_docs],
          },
          {
            id: 'w4-b2',
            track: 'build',
            title: 'Standalone Triton matmul kernel that hits Tensor Cores',
            body:
              'Tile sizes constrained to TC-multiples (BLOCK_M, BLOCK_N ∈ {64, 128, 256}, BLOCK_K ∈ {32, 64}). fp16 inputs, fp32 accumulator. Verify TC utilization with NCU before moving on.',
            verify:
              '≥80% of torch.matmul TFLOPs/s at 4096×4096×4096 fp16 on H100; NCU shows tensor-core utilization >50%',
            hours: '4h',
            prereqs: ['w4-b1'],
            resources: [R.triton_docs, R.siboehm_matmul, R.ncu_docs],
          },
          {
            id: 'w4-b3',
            track: 'build',
            title: 'Fused RMSNorm + Matmul — single kernel',
            body:
              'One kernel: load tile, apply per-row RMSNorm in registers/SMEM, then matmul against weight tile. Saves one global-memory roundtrip on the activation. Fp16/bf16 input, fp32 accumulator, fp16 output.',
            verify:
              'Fused output matches torch.matmul(rmsnorm(x), W) atol 1e-3 on (B=32, H=4096, O=4096); correctness test in tests/ passes',
            hours: '5h',
            prereqs: ['w4-b2'],
            resources: [R.triton_docs, R.triton_autotune],
          },
          {
            id: 'w4-b4',
            track: 'build',
            title: 'Autotune sweep + winning-config log',
            body:
              '@triton.autotune across (BLOCK_M, BLOCK_N, BLOCK_K, num_warps, num_stages). Log winner per shape — the table itself is interview material.',
            verify: 'kernels/autotune-results.md with winning configs across 6+ shapes',
            hours: '2h',
            prereqs: ['w4-b3'],
          },
          {
            id: 'w4-a1',
            track: 'apply',
            title: 'Apps wave 1 — 5 roles',
            body:
              '2 Hyderabad-local (Qualcomm AI Research, MS IDC). 3 remote AI infra (Modal, Together, Hugging Face).',
            verify: 'Confirmation emails for all 5',
            hours: '2h',
          },
          {
            id: 'w4-a2',
            track: 'apply',
            title: 'Cold DMs — 3 engineers',
            body:
              'One per company from wave 1. 3 sentences: who you are, what you shipped (gpu-warmup repo + WIP fused kernel), one ask.',
            verify: '3 messages sent',
            hours: '1h',
          },
          {
            id: 'w4-p1',
            track: 'prep',
            title: 'NeetCode two-pointers — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
      },
      {
        number: 5,
        title: 'Benchmark vs torch.compile + NCU profiling',
        goal:
          'Three-axis sweep (batch × hidden × dtype) comparing torch eager, torch.compile, and the fused Triton kernel. NCU reports captured for 3 representative shapes with tensor-core %, achieved bandwidth, occupancy, SMEM bank conflicts.',
        tasks: [
          {
            id: 'w5-r1',
            track: 'read',
            title: 'NCU docs — metrics tree + Tensor Core / memory sections',
            body:
              'You only need a working subset: sm__pipe_tensor_op_hmma_cycles_active.avg.pct_of_peak_sustained_active (TC %), dram__bytes.sum.per_second (HBM bw), launch__occupancy_limit_*. The mental model of the metric tree is the durable part.',
            verify:
              'Notes: write the 8 metrics you will read off every NCU report and what each one tells you',
            hours: '2h',
            resources: [R.ncu_docs, R.pytorch_profiler],
          },
          {
            id: 'w5-r2',
            track: 'read',
            title: 'torch.compile — what does it actually fuse?',
            body:
              'TorchInductor + Triton codegen. For a small RMSNorm→Linear graph, will torch.compile produce one kernel or two? Predict, then verify with TORCH_LOGS=output_code.',
            verify:
              'Notes: write what torch.compile emits for rmsnorm(x) @ W, with the generated kernel name(s)',
            hours: '2h',
            resources: [R.torch_compile, R.horace_brrr],
          },
          {
            id: 'w5-b1',
            track: 'build',
            title: 'bench.py — 3-axis sweep harness',
            body:
              'Sweep batch ∈ {1, 8, 32, 128} × hidden ∈ {2048, 4096, 8192} × dtype ∈ {fp16, bf16}. Measure latency (median of 100 timed iters, 50 warmup, cuda.synchronize), achieved TFLOPs/s, achieved HBM bandwidth. Three variants: (a) torch eager separate ops, (b) torch.compile, (c) your fused Triton.',
            verify:
              'One H100 run produces a CSV with all variants × all shapes; numbers reproducible (±2%) across reruns',
            hours: '4h',
          },
          {
            id: 'w5-b2',
            track: 'build',
            title: 'NCU profiles — 3 representative shapes',
            body:
              'Pick three shapes that span regimes: (B=1, H=4096) decode-like → memory-bound; (B=32, H=4096) intermediate; (B=128, H=8192) compute-bound. Run `ncu --set full` on each variant for each shape. Save .ncu-rep files.',
            verify:
              'ncu/ folder has 9 reports (3 shapes × 3 variants); ncu-summary.md tabulates TC%, HBM bw, occupancy, SMEM bank conflicts per cell',
            hours: '4h',
            prereqs: ['w5-b1'],
            resources: [R.ncu_docs],
          },
          {
            id: 'w5-b3',
            track: 'build',
            title: 'Three plots with roofline overlays',
            body:
              '(1) latency vs shape (3 lines), (2) achieved TFLOPs/s vs shape with peak-TC roofline, (3) achieved HBM bw vs shape with peak-HBM roofline. The roofline lines are the whole point — the reader sees the gap immediately.',
            verify: '3 PNGs in plots/, with roofline lines drawn',
            hours: '2h',
            prereqs: ['w5-b2'],
          },
          {
            id: 'w5-a1',
            track: 'apply',
            title: 'Apps wave 2 — 5 roles',
            body: 'Bangalore relocation: NVIDIA, AMD. Remote: fal.ai, Replicate, Lambda.',
            verify: 'Confirmations for all 5',
            hours: '2h',
          },
          {
            id: 'w5-a2',
            track: 'apply',
            title: 'Cold DMs — 3 more',
            verify: '3 sent',
            hours: '1h',
          },
          {
            id: 'w5-p1',
            track: 'prep',
            title: 'NeetCode sliding-window — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
      },
      {
        number: 6,
        title: 'Roofline analysis — predict, then verify',
        goal:
          'For every shape in the sweep, the regime (compute / memory / overhead) is predicted from arithmetic intensity BEFORE looking at the NCU report; then verified, with every gap explained. ROOFLINE.md drafted.',
        tasks: [
          {
            id: 'w6-r1',
            track: 'read',
            title: 'Re-read Horace He brrrr + Hopper whitepaper',
            body:
              'The third regime is overhead — kernel-launch latency, dispatcher cost, host/device sync. Easy to miss at small batch.',
            verify: 'Notes: derive H100 ridge-point arithmetic intensity (≈ 295 fp16 FLOPs/byte) from peak TC + HBM3',
            hours: '2h',
            resources: [R.horace_brrr, R.hopper_whitepaper],
          },
          {
            id: 'w6-r2',
            track: 'read',
            title: 'Published kernel benchmarks — calibrate "what is good"',
            body:
              'Skim 1–2 H100 fp16 GEMM perf write-ups (CUTLASS examples / Chips and Cheese / FA-3 paper appendix). What fraction of peak do production kernels actually hit?',
            verify: 'Notes: the realistic %-of-peak band (e.g., 65–85% TC for non-square fp16 GEMM)',
            hours: '1.5h',
            resources: [R.cutlass_cute_paper, R.chips_cheese, R.flashattn_paper],
          },
          {
            id: 'w6-b1',
            track: 'build',
            title: 'Predict the bound for every shape — BEFORE looking at NCU',
            body:
              'For each (batch, hidden, dtype) cell: compute arithmetic intensity (FLOPs/byte for the fused op), compare to ridge point, predict regime + a number (e.g., "memory-bound, ~70% of HBM peak"). Write predictions into a table FIRST, sealed before opening NCU. This is the discipline.',
            verify:
              'docs/predictions.md with a row per shape: AI, predicted regime, predicted % of peak; timestamped commit BEFORE any NCU verification commit',
            hours: '3h',
            resources: [R.horace_brrr],
          },
          {
            id: 'w6-b2',
            track: 'build',
            title: 'Verify predictions vs NCU; explain every gap',
            body:
              'For each cell: read NCU, write the achieved number next to the predicted one. Where prediction was wrong, explain why (tile size, occupancy floor, SMEM bank conflict, kernel-launch overhead, dtype mismatch with TC mode). The explanations are the writeup\'s spine.',
            verify:
              'docs/verification.md updates the predictions table with achieved numbers + a 1–3 sentence explanation per row',
            hours: '4h',
            prereqs: ['w6-b1'],
            resources: [R.ncu_docs],
          },
          {
            id: 'w6-b3',
            track: 'build',
            title: 'ROOFLINE.md draft (1500–2500 words)',
            body:
              'Sections: (1) H100 hardware roofline (numbers + diagram), (2) op-level arithmetic intensity for fused vs unfused, (3) per-shape predictions table, (4) NCU verification + every gap explained, (5) three lessons learned, (6) reproduction commands. No marketing tone — engineer-readable.',
            verify: 'ROOFLINE.md committed; passes a cold read by yourself the next morning',
            hours: '4h',
            prereqs: ['w6-b2'],
          },
          {
            id: 'w6-b4',
            track: 'build',
            title: '(Stretch) Add a second fused op — fused SiLU + Matmul (SwiGLU half)',
            body:
              'Optional. Skip if anything above slipped. The fused SwiGLU half is a higher-leverage real-world op; demonstrates the kernel pattern generalizes.',
            verify: 'kernels/fused_silu_mm.py passes correctness; one-row entry added to the bench table',
            hours: '4h',
          },
          {
            id: 'w6-p1',
            track: 'prep',
            title: 'NeetCode binary-search — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
      },
      {
        number: 7,
        title: 'Ship Capstone 1',
        goal:
          'fused-rmsnorm-mm public + ROOFLINE.md polished + reproduction script verified on a clean H100. Repo URL + ROOFLINE.md URL go into cover letters from now on.',
        tasks: [
          {
            id: 'w7-b1',
            track: 'build',
            title: 'Polish README',
            body:
              'Title, one-paragraph claim ("fused RMSNorm+Matmul in Triton, X% of peak TC, predicted bound matches NCU within Y%"), the 3 plots with roofline overlays, exact reproduction commands, links to ROOFLINE.md and ncu/. A stranger should be able to clone and reproduce one number in 10 minutes on H100.',
            verify:
              'Stranger can clone and reproduce one cell of the bench table within 10 min on H100; README opens with the claim, not the journey',
            hours: '4h',
          },
          {
            id: 'w7-b2',
            track: 'build',
            title: 'ROOFLINE.md final polish',
            body:
              'Cover-letter readable. No marketing tone. Every claim has a number; every number has a source (NCU report file or whitepaper). One paragraph per shape — what was predicted, what was measured, what the gap means.',
            verify: 'File reads honest; every prediction has a measured counterpart',
            hours: '3h',
          },
          {
            id: 'w7-b3',
            track: 'build',
            title: 'Flip fused-rmsnorm-mm public; verify reproduction',
            verify:
              'github.com/<user>/fused-rmsnorm-mm returns 200 unauthenticated; `make bench` reproduces on a fresh Modal H100 in <10 min; NCU reports linked in the README open',
            hours: '1h',
            prereqs: ['w7-b1', 'w7-b2'],
          },
          {
            id: 'w7-a1',
            track: 'apply',
            title: 'LinkedIn featured update',
            body: 'Pin fused-rmsnorm-mm repo + ROOFLINE.md in featured. No announcement post.',
            verify: 'Live',
            hours: '30m',
            prereqs: ['w7-b3'],
          },
          {
            id: 'w7-a2',
            track: 'apply',
            title: 'Follow up wave 1+2 with repo + roofline links',
            body:
              'Same DMs from weeks 4–5, now with fused-rmsnorm-mm URL + ROOFLINE.md URL. The roofline writeup is the differentiator — most candidates do not have one.',
            verify: '5 follow-ups sent',
            hours: '1h',
            prereqs: ['w7-b3'],
          },
          {
            id: 'w7-p1',
            track: 'prep',
            title: 'NeetCode trees — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
      },
    ],
  },

  {
    id: 'phase-3',
    title: 'Phase 3 — Front-load tier-1 applications + buffer',
    blurb:
      'One week. Capstone 1 (fused-rmsnorm-mm + ROOFLINE.md) shipped — now apply to every tier-1 inference target with referrals, before Capstone 2 starts. Loops will run in parallel with Phase 4.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-fg-dim)',
    context:
      'This is the moved-up application milestone. With fused-rmsnorm-mm + NCU reports + ROOFLINE.md all shipped by W7, this week is when tier-1 applications go out — Modal, Together, Anthropic Inference, NVIDIA Bangalore, Fireworks, Replicate, fal.ai, Lambda. Real loops take 6–8 weeks. If apps go out W8, offers land W14–W16; if they wait until W15, offers land W22+ which is past runway. Buffer / attention reimpl is secondary; the apps wave is the point.',
    weeks: [
      {
        number: 8,
        title: 'Tier-1 apply wave + buffer',
        goal:
          '12 tier-1 applications submitted (referrals where possible). Capstone 1 polish. Optional attention reimpl as Capstone-2 prep.',
        tasks: [
          {
            id: 'w8-a1',
            track: 'apply',
            title: 'Tier-1 apply wave — 12 roles, referral-first',
            body:
              'The hot list, in priority order: Anthropic Inference (Bengaluru / remote), Modal, Together, Fireworks, NVIDIA Bangalore (Compute / TensorRT-LLM), Replicate, fal.ai, Lambda, Cerebras, Groq, Hyderabad-local (Qualcomm AI, MS IDC), one Bangalore stretch (AMD ROCm). Submit via referral if you have one — cold portal otherwise. Cover-letter ≤200 words; lead with fused-rmsnorm-mm URL + ROOFLINE.md URL + the headline number ("X% of TC peak, predicted memory-bound at ridge/8 verified by NCU within Y%").',
            verify: '12 confirmations; ≥4 went via warm referral',
            hours: '5h',
          },
          {
            id: 'w8-a2',
            track: 'apply',
            title: 'Cold DMs — 8 with fused-kernel + ROOFLINE links',
            body:
              'Target hiring managers + senior ICs at the 12 companies above. 3-sentence template: who, what shipped (repo + ROOFLINE.md), one ask. The roofline writeup is the unlock — most candidates do not have one.',
            verify: '8 sent',
            hours: '2h',
          },
          {
            id: 'w8-a3',
            track: 'apply',
            title: 'CV + LinkedIn update',
            body:
              'New "AI Systems Projects" section. Lead: fused-rmsnorm-mm (links to repo, ROOFLINE.md, NCU summary). Pin in LinkedIn Featured.',
            verify: 'PDF committed to private repo; LinkedIn live',
            hours: '1.5h',
          },
          {
            id: 'w8-r1',
            track: 'read',
            title: 'FlashAttention paper',
            verify: '1-page notes',
            hours: '2h',
            resources: [R.flashattn_paper],
          },
          {
            id: 'w8-b1',
            track: 'build',
            title: '(Optional) PyTorch attention reimpl',
            body:
              'GQA + RoPE + tiled forward with online softmax. Match Llama-3.2-1B atol 1e-3. Skip if any of the apps tasks slipped.',
            verify: 'Test passes vs HF reference',
            hours: '6–10h',
            resources: [R.mosaic_attention],
          },
          {
            id: 'w8-b2',
            track: 'build',
            title: 'Capstone 1 second-pass polish',
            body: 'Fix anything you noticed reading the README cold; tighten the postmortem.',
            verify: 'README + postmortem clean',
            hours: '2h',
          },
          {
            id: 'w8-p1',
            track: 'prep',
            title: 'NeetCode graphs — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
          {
            id: 'w8-p2',
            track: 'prep',
            title: 'Designing ML Systems ch.4',
            verify: 'Notes',
            hours: '2h',
            resources: [R.chip_huyen_design],
          },
        ],
        reading: [R.weng_transformer, R.annotated_transformer],
      },
    ],
  },

  {
    id: 'phase-4',
    title: 'Phase 4 — Capstone 2 · Three matmuls, three DSLs (in parallel with interview loops)',
    blurb:
      'Same GEMM in Triton, CUTLASS, ThunderKittens. Profiled with ncu. CUTLASS is the gate. Six weeks — running concurrent with active interview loops from W8 apps.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-compilers)',
    artifact: 'kernels-3-ways public repo + ncu comparison + 1 OSS PR',
    context:
      'CUTLASS is the gate. If CUTLASS does not compile by end of Week 11, drop CUTLASS, do TileLang or Triton-only, and move on. Do not let CUTLASS sink the schedule. The artifact value is the comparison, not any one kernel. Critical reframe: this Phase runs while W8 applications convert to recruiter screens and onsite loops. Capstone-2 is fresh interview material — discussing your in-progress matmul work in loops is a feature, not a bug, and forces the test that you actually understand the code.',
    weeks: [
      {
        number: 9,
        title: 'Setup + bench harness',
        goal: 'bench.py producing clean cuBLAS TFLOPs/s. Skeleton repo with the 3 placeholder dirs.',
        tasks: [
          {
            id: 'w9-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W9 Capstone 2',
            body:
              'Can you do these cold? (Verifies that Capstone 1 fluency landed)\n' +
              '  • Triton kernel authoring — autotune, BLOCK constants, program_id math\n' +
              '  • NCU report reading — TC% utilization, kernel-time pie, HBM throughput\n' +
              '  • Roofline AI calculation for an arbitrary matmul shape\n' +
              'Capstone 2 is three matmuls in three DSLs in parallel with interview loops — gap-fills mid-week cost days. If Capstone 1 was a slog, redo the W5 NCU writeup before reading r1.',
            verify: 'Quick self-check; revisit C1 NCU report if any reflex rating <3',
            hours: '15m check + remediation in flight',
            resources: [R.triton_docs, R.horace_brrr, R.hopper_whitepaper],
          },
          {
            id: 'w9-r1',
            track: 'read',
            title: 'FlashAttention-2 paper',
            verify: 'Notes',
            hours: '1.5h',
            resources: [R.flashattn2_paper],
          },
          {
            id: 'w9-r2',
            track: 'read',
            title: 'Mosaic compilers/kernels track',
            body: 'Triton, CuTe/CUTLASS 4, ThunderKittens / TileLang lessons.',
            verify: 'Cheatsheet entries reviewed',
            hours: '2h',
            resources: [R.mosaic_kernels, R.mosaic_compilers],
          },
          {
            id: 'w9-r3',
            track: 'read',
            title: 'Hopper TMA + async docs',
            verify: 'Notes on TMA load/store + async-pipelined warps',
            hours: '1.5h',
            resources: [R.hopper_tma, R.hopper_whitepaper],
          },
          {
            id: 'w9-b1',
            track: 'build',
            title: 'bench.py',
            body:
              '50 warmup + 50 timed runs. fp16 inputs M=N=2048 K=4096. cuda.synchronize before timing. Baseline torch.matmul.',
            verify: 'Clean cuBLAS TFLOPs/s reading on Modal H100',
            hours: '3h',
          },
          {
            id: 'w9-b2',
            track: 'build',
            title: 'Create kernels-3-ways private repo',
            body: 'Skeleton: triton/, cutlass/, kittens/, bench.py.',
            verify: 'Repo URL exists',
            hours: '30m',
          },
          {
            id: 'w9-a1',
            track: 'apply',
            title: 'Follow up no-reply DMs from weeks 4–7',
            verify: '5 follow-ups sent',
            hours: '1h',
          },
          {
            id: 'w9-p1',
            track: 'prep',
            title: 'NeetCode DP — 5 problems',
            verify: '5 accepted',
            hours: '2.5h',
            resources: [R.neetcode],
          },
          {
            id: 'w9-p2',
            track: 'prep',
            title: 'Designing ML Systems ch.5',
            verify: 'Notes',
            hours: '1.5h',
            resources: [R.chip_huyen_design],
          },
        ],
      },
      {
        number: 10,
        title: 'Triton autotuned matmul',
        goal: '75–90% of cuBLAS, with ncu profile saved.',
        tasks: [
          {
            id: 'w10-r1',
            track: 'read',
            title: 'Triton autotune docs deep read',
            verify: 'Notes on (BLOCK_M, BLOCK_N, BLOCK_K, num_warps, num_stages)',
            hours: '1.5h',
            resources: [R.triton_autotune],
          },
          {
            id: 'w10-b1',
            track: 'build',
            title: 'Triton matmul + autotune',
            body: '6–8 configs spanning the search space.',
            verify: 'Passes correctness vs torch.matmul (atol 1e-2 fp16)',
            hours: '4h',
            resources: [R.triton_docs],
          },
          {
            id: 'w10-b2',
            track: 'build',
            title: 'Bench Triton vs cuBLAS',
            verify: '75–90% of cuBLAS TFLOPs/s at M=N=2048',
            hours: '2h',
            prereqs: ['w10-b1'],
          },
          {
            id: 'w10-b3',
            track: 'build',
            title: 'ncu --set full profile (Triton)',
            verify: 'ncu report saved, tensor-core % noted',
            hours: '2h',
            prereqs: ['w10-b2'],
            resources: [R.ncu_docs],
          },
          {
            id: 'w10-a1',
            track: 'apply',
            title: 'Apps wave 4 — 5 roles',
            verify: '5 confirmations',
            hours: '2h',
          },
          {
            id: 'w10-p1',
            track: 'prep',
            title: 'NeetCode backtracking — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
          {
            id: 'w10-p2',
            track: 'prep',
            title: 'Designing ML Systems ch.6',
            verify: 'Notes',
            hours: '1.5h',
            resources: [R.chip_huyen_design],
          },
        ],
      },
      {
        number: 11,
        title: 'CUTLASS — get it compiling',
        goal: 'A known-working Hopper GEMM example runs from your repo. This is the gate.',
        tasks: [
          {
            id: 'w11-r1',
            track: 'read',
            title: 'CUTLASS Hopper tutorial + CollectiveBuilder',
            verify: 'Notes on tile shape, cluster shape, kernel schedule',
            hours: '3h',
            resources: [R.cutlass_repo],
          },
          {
            id: 'w11-r2',
            track: 'read',
            title: 'CuTe primer (layout, atom)',
            verify: 'Notes',
            hours: '2h',
            resources: [R.cutlass_repo],
          },
          {
            id: 'w11-b1',
            track: 'build',
            title: 'Compile a CUTLASS Hopper GEMM example',
            body:
              'Pin the exact (ElementA, LayoutA, ElementB, LayoutB, ElementAcc, ElementOutput) tuple from a known-working example before touching anything.',
            verify: 'bench.py reads ≥80% cuBLAS TFLOPs/s',
            hours: '4h',
          },
          {
            id: 'w11-b2',
            track: 'build',
            title: 'Adapt to your settings',
            body: 'M=N=2048 K=4096 fp16.',
            verify: 'Passes correctness vs torch.matmul',
            hours: '4h',
            prereqs: ['w11-b1'],
          },
          {
            id: 'w11-a1',
            track: 'apply',
            title: 'Apps wave 5 — 5 roles',
            verify: '5 confirmations',
            hours: '2h',
          },
          {
            id: 'w11-p1',
            track: 'prep',
            title: 'NeetCode (mixed) — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
      },
      {
        number: 12,
        title: 'CUTLASS — tune to 85%+',
        goal:
          'Pingpong schedule, 128×128×64 tile, 2-CTA cluster. ncu profile shows higher tensor-core util than Triton.',
        tasks: [
          {
            id: 'w12-b1',
            track: 'build',
            title: 'KernelTmaWarpSpecializedPingpong',
            body: '128×128×64 tile, 2-CTA cluster.',
            verify: 'Compiles, runs, bench reads ≥85% cuBLAS',
            hours: '6h',
            prereqs: ['w11-b2'],
          },
          {
            id: 'w12-b2',
            track: 'build',
            title: 'ncu profile (CUTLASS)',
            verify: 'Tensor-core % > Triton',
            hours: '2h',
            prereqs: ['w12-b1'],
            resources: [R.ncu_docs],
          },
          {
            id: 'w12-p1',
            track: 'prep',
            title: 'Designing ML Systems ch.7',
            verify: 'Notes',
            hours: '1.5h',
            resources: [R.chip_huyen_design],
          },
          {
            id: 'w12-p2',
            track: 'prep',
            title: 'NeetCode (mixed) — 4 problems',
            verify: '4 accepted',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
      },
      {
        number: 13,
        title: 'ThunderKittens (or TileLang)',
        goal: 'Third DSL working. Pick whichever stands up faster on Modal.',
        tasks: [
          {
            id: 'w13-r1',
            track: 'read',
            title: 'TK README + kernels/matmul/ reference',
            verify: 'Notes',
            hours: '2h',
            resources: [R.thunderkittens],
          },
          {
            id: 'w13-r2',
            track: 'read',
            title: '(Alt) TileLang primer if TK build is broken',
            verify: 'Notes',
            hours: '1.5h',
          },
          {
            id: 'w13-b1',
            track: 'build',
            title: '64×64 register-tile GEMM',
            body:
              'TMA loads + 2-stage pipeline. When stuck, copy verbatim from a known-working example, then modify.',
            verify: 'Compiles, passes correctness',
            hours: '6h',
            resources: [R.thunderkittens],
          },
          {
            id: 'w13-b2',
            track: 'build',
            title: 'Bench (TK/TileLang)',
            verify: 'Within 5% of CUTLASS',
            hours: '1.5h',
            prereqs: ['w13-b1'],
          },
          {
            id: 'w13-b3',
            track: 'build',
            title: 'ncu profile (TK/TileLang)',
            verify: 'Report saved',
            hours: '1h',
            prereqs: ['w13-b2'],
          },
          {
            id: 'w13-p1',
            track: 'prep',
            title: '1 mock CUDA/Triton interview problem (timed)',
            body: 'GPU MODE discord posts these regularly. Pick one. Time-box it.',
            verify: 'Written post-mortem',
            hours: '2h',
            resources: [R.gpu_mode, R.leetgpu],
          },
          {
            id: 'w13-p2',
            track: 'prep',
            title: 'Designing ML Systems ch.8',
            verify: 'Notes',
            hours: '1.5h',
            resources: [R.chip_huyen_design],
          },
        ],
      },
      {
        number: 14,
        title: 'Profile, write up, ship',
        goal: 'Comparison table + POSTMORTEM. kernels-3-ways public. One OSS PR opened.',
        tasks: [
          {
            id: 'w14-b1',
            track: 'build',
            title: '3-row comparison table',
            body: 'Tensor-core %, SMEM bank conflicts, TFLOPs/s, LOC. From the three ncu reports.',
            verify: 'Table in README',
            hours: '2h',
          },
          {
            id: 'w14-b2',
            track: 'build',
            title: 'README polish',
            body: 'Diagram, benchmark plot vs cuBLAS, exact reproduction commands per DSL.',
            verify: 'Stranger can clone and reproduce one number',
            hours: '4h',
          },
          {
            id: 'w14-b3',
            track: 'build',
            title: 'POSTMORTEM.md',
            body:
              '"Same matmul, three DSLs — what each one cost me." LOC vs perf, ncu table, felt sense of which DSL you would reach for next.',
            verify: '1500–2500 words, file committed',
            hours: '4h',
          },
          {
            id: 'w14-b4',
            track: 'build',
            title: 'Flip kernels-3-ways public',
            verify: '200 unauthenticated',
            hours: '15m',
            prereqs: ['w14-b2', 'w14-b3'],
          },
          {
            id: 'w14-b5',
            track: 'build',
            title: 'One OSS PR',
            body:
              'gpu-mode/lectures (add three impls as reference) OR small docs/test PR to triton/cutlass.',
            verify: 'PR URL',
            hours: '3h',
            resources: [R.gpu_mode_lectures_repo, R.vllm_repo],
          },
          {
            id: 'w14-a1',
            track: 'apply',
            title: 'Stretch / second-tier wave — 10 roles',
            body:
              'Tier-1 went out W8. This wave hits the second tier + any new openings since W8: AMD, Intel Habana, Meta GenAI infra, ByteDance Inference, Cohere, Mistral, training shops (Mosaic/DataBricks). Add fresh kernels-3-ways URL to all.',
            verify: '10 confirmations',
            hours: '4h',
          },
          {
            id: 'w14-a2',
            track: 'apply',
            title: 'Active loop management — 5 follow-ups',
            body:
              'By W14 your W8 applications are at recruiter-screen / first-round stage. Send post-interview thank-yous, follow up on stalled processes, schedule onsites with the new kernels-3-ways link.',
            verify: '5 sent',
            hours: '1.5h',
          },
          {
            id: 'w14-a3',
            track: 'apply',
            title: 'CV + LinkedIn featured update',
            verify: 'Live',
            hours: '1h',
            prereqs: ['w14-b4'],
          },
          {
            id: 'w14-p1',
            track: 'prep',
            title: '2 mock CUDA/Triton problems (timed)',
            verify: 'Post-mortems',
            hours: '4h',
            resources: [R.leetgpu, R.gpu_mode],
          },
        ],
      },
    ],
  },

  {
    id: 'phase-5',
    title: 'Phase 5 — Close loops + offer negotiation',
    blurb:
      'Two weeks of closing the loops opened in W8. System design rounds, paper discussions, behavioral, offer negotiation. Final stretch apps only if no offers in hand.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-training)',
    context:
      'Reframed: this is no longer "now we apply" — that happened in W8. This is "now we close." Loops opened W8 are at onsite / final-round / verbal-offer stage. The three system design write-ups (low-latency LLM serving, quantize-and-serve 70B, distributed training 100B) cover ~80% of asked surface. Per-company primers beat generic prep. If multiple offers materialize, this is the negotiation window. If none, the gap is artifact strength or interview execution — diagnose honestly before throwing more applications at the wall.',
    weeks: [
      {
        number: 15,
        title: 'Interview ramp',
        goal: 'STAR stories ready. Two system design write-ups. Pending loops scheduled.',
        tasks: [
          {
            id: 'w15-r1',
            track: 'read',
            title: 'Designing ML Systems ch.9–10',
            verify: 'Notes',
            hours: '3h',
            resources: [R.chip_huyen_design],
          },
          {
            id: 'w15-b1',
            track: 'build',
            title: 'System design — low-latency LLM serving (with prefill/decode disagg)',
            body:
              'Continuous batching, PagedAttention, speculative decoding, prefill/decode disaggregation (DistServe). 2–3 pages. End with: how would you measure success, what is your SLO budget, what fails first under 10× load.',
            verify: 'Doc committed',
            hours: '3.5h',
            resources: [R.vllm_docs, R.paged_attention, R.eagle_paper, R.distserve_paper, R.hao_ai],
          },
          {
            id: 'w15-b2',
            track: 'build',
            title: 'System design — quantize & serve 70B at <100ms TTFT (FP8/FP4 numerics)',
            body:
              'Cover: TP/PP layout for 70B on 8×H100, FP8 (E4M3 vs E5M2) calibration, MXFP4 on Blackwell, KV cache offload, $/Mtoken budget. Numerics is the round people fail.',
            verify: '2-page doc committed',
            hours: '3.5h',
            resources: [R.trt_llm, R.han_6_5940, R.fp8_overview, R.mxfp4_paper],
          },
          {
            id: 'w15-b3',
            track: 'build',
            title: 'System design — distributed training of 100B at 8×H100 → 256×H100',
            body:
              'TP × PP × DP × FSDP layout, ring-allreduce vs tree, NCCL collectives, gradient accumulation under TP boundary, sequence parallelism, NaN-bomb recovery, checkpoint cadence. End with: how do you debug an FSDP hang at 3am.',
            verify: '2-page doc committed',
            hours: '3.5h',
            resources: [
              R.ultrascale,
              R.weng_train_large,
              R.stas_book,
              R.nccl_internals,
              R.ring_allreduce,
            ],
          },
          {
            id: 'w15-a1',
            track: 'apply',
            title: 'Schedule pending loops',
            verify: 'Calendar entries for any active interview processes',
            hours: '1h',
          },
          {
            id: 'w15-a2',
            track: 'apply',
            title: '5 follow-ups',
            verify: 'Sent',
            hours: '1h',
          },
          {
            id: 'w15-p1',
            track: 'prep',
            title: '6 STAR stories',
            body: 'Production incident, scaling, mentoring, conflict, ambiguity, leadership. ~150 words each.',
            verify: 'Doc with 6 entries',
            hours: '3h',
          },
          {
            id: 'w15-p2',
            track: 'prep',
            title: '4 mock interview problems',
            body: 'Mix CUDA + system design.',
            verify: 'Post-mortems',
            hours: '4h',
            resources: [R.leetgpu, R.sundeep_interview],
          },
          {
            id: 'w15-p3',
            track: 'prep',
            title: 'NeetCode review — 5 problems you got wrong',
            verify: '5 re-solved',
            hours: '2.5h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.sundeep_interview, R.eleuther_math],
      },
      {
        number: 16,
        title: 'Close offers / final apply if needed',
        goal: 'Active loops at offer or near-offer stage. Negotiation in progress. Stretch apps only if no offers materialized.',
        tasks: [
          {
            id: 'w16-b1',
            track: 'build',
            title: 'Per-company primers (active loops)',
            body: 'For each onsite/final loop: what they ship, who interviews, likely topics. 1 page each.',
            verify: '3+ docs',
            hours: '3h',
          },
          {
            id: 'w16-b2',
            track: 'build',
            title: 'Top-10 questions per company',
            body: 'Written answers, not just bullet points.',
            verify: 'Doc with 30 answers',
            hours: '3h',
          },
          {
            id: 'w16-a1',
            track: 'apply',
            title: 'Stretch apps wave (only if zero offers in hand)',
            body:
              'If offers are landing — skip this entirely and focus on negotiation. If not, 10 fresh apps + a brutally honest diagnosis: artifact gap or interview-execution gap?',
            verify: '10 confirmations OR documented decision to skip',
            hours: '4h',
          },
          {
            id: 'w16-a2',
            track: 'apply',
            title: 'Offer negotiation + competing-offer leverage',
            body:
              'If multiple offers: be transparent with each about the others. Negotiate base + signing + RSU separately. Get all offers in writing before deciding.',
            verify: 'Negotiation rounds logged; final offer numbers committed to private tracker',
            hours: '4h',
          },
          {
            id: 'w16-p1',
            track: 'prep',
            title: '4 mock interviews under live conditions',
            body: 'A friend or just timed alone. Record yourself if alone.',
            verify: 'Post-mortems for each',
            hours: '6h',
          },
          {
            id: 'w16-c1',
            track: 'read',
            title: 'Curriculum Review — refresh Year 1 plan before sprint ends',
            body:
              'Before the multi-year arc starts, audit the next year. (a) Are the OSS targets still active and well-maintained? (b) Are the listed papers still current — has anything been superseded? (c) Are the lab hiring practices still the same? (d) Replace any fast-decay items in W17–W20. The Bedrock layer is fine; only the framework/paper layer rots.',
            verify: 'Y1Q1–Q4 reviewed; replacements logged in /atlas-plan-changelog.md',
            hours: '2h',
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // YEAR 1 — Land + level up systems depth
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'phase-6',
    title: 'Phase 6 — Year 1 · Land + level up',
    blurb:
      'First year in role. Math remediation 30–60 min/day, a portfolio of 5–10 quality OSS PRs across vLLM/SGLang/Triton with at least one cited perf improvement, one paper reproduction with a novel ablation, one multi-node FSDP training run. Senior IC by month 12.',
    year: 1,
    cadence: 'quarter',
    color: 'var(--m-track-applied)',
    artifact:
      '5–10 PRs merged across vLLM / SGLang / Triton (50–200 LOC each, mix of bug-fixes + small features + perf tweaks) · ≥1 PR ships a measurable perf improvement explicitly cited by maintainers (release notes, PR description, or design doc) · paper reproduction repo public WITH a novel ablation or found-bug · one multi-node FSDP training run on 8×H100 (rented, ~$200) · 2–4 deep blog posts · personal site live · Senior IC at new company',
    context:
      'You are in a role. Now close the gaps that will gate you at Year-3 elite-lab loops: math (the silent killer), paper-reading habit, OSS credibility, one paper reproduction with a NOVEL ABLATION or FOUND-BUG (a vanilla repro is table-stakes by 2026), and one multi-node FSDP training run so you can answer "have you ever debugged an NCCL hang" with a yes. The Y1 OSS goal was reset after the Final-Boss audit: the previous "one named feature merged in vLLM, >500 LOC" goal was a stretch that fails silently — vLLM PR queue depth, codebase churn (V1 engine rewrite), and vendor-driven roadmaps (NVIDIA / AMD / Red Hat) make a single big outsider feature unreliable. Replace with a portfolio of 5–10 quality PRs across vLLM / SGLang / Triton, each 50–200 LOC, with at least ONE landing a measurable perf improvement that maintainers cite by name. Quality-gated, not vanity-counted. Year 2 then deepens into one project for subsystem ownership. Math is non-negotiable — 30–60 min/day for 6 months.',
    weeks: [
      {
        number: 17,
        title: 'Y1·Q1 — Settle in + math habit installed',
        goal:
          'Onboarded, first feature shipped, math habit running. Personal site live. First paper read in role.',
        tasks: [
          {
            id: 'y1q1-prereq',
            track: 'prep',
            stream: 'core',
            title: 'Prerequisites — verify before Y1 starts',
            body:
              'You\'ve landed an AI infra role. Before the math/OSS/paper-reading habit kicks in:\n' +
              '  • Capstone 1 + Capstone 2 repos public + readable by recruiters\n' +
              '  • Math: can you derive softmax\'s Jacobian + backprop for one MLP layer cold?\n' +
              '  • Paper-reading: do you have a 3-pass method (Keshav) or a personal equivalent?\n' +
              '  • Calendar: 30-60 min/day math block scheduled (recurring, immovable)\n' +
              'If math feels rusty, Karpathy Z2H ep 1-3 (micrograd → makemore) is the unblocker for the year. If 3-pass method is new, Keshav (1h) is non-negotiable — you\'ll read 24+ papers in Y1.',
            verify: 'Quick self-check; Karpathy ep 1 watched before y1q1-r1; math calendar block on schedule',
            hours: '30m check + remediation in flight',
            resources: [R.karpathy_z2h, R.threeB1B_linalg],
          },
          {
            id: 'y1q1-b1',
            track: 'build',
            stream: 'core',
            title: 'Ship first owned feature in role',
            body:
              'Pick a small but visible piece of work. Get it through code review. Build relationships with reviewers — they become Y3 references.',
            verify: 'PR merged in company codebase, in production behind a flag',
            hours: '40h',
          },
          {
            id: 'y1q1-b2',
            track: 'build',
            stream: 'systems',
            title: 'First OSS PR opened — vLLM / SGLang / Triton (any size)',
            body:
              'Start with docs/tests/typo/small bug if needed. Goal is to learn the contribution flow on at least one of the three target projects before the bigger stuff. Hang in their Discord/issues for a week first to spot good first targets.',
            verify: 'PR opened against vllm-project/vllm OR sgl-project/sglang OR triton-lang/triton',
            hours: '6h',
            resources: [R.vllm_repo, R.vllm_docs, R.sglang_docs, R.triton_docs],
          },
          {
            id: 'y1q1-b3',
            track: 'build',
            stream: 'core',
            title: 'Personal site live',
            body:
              'Single-page Karpathy-style site. Capstone-1 + Capstone-2 pinned. Domain you own. No tracking pixels.',
            verify: 'Site loads on a custom domain, both repos linked',
            hours: '6h',
          },
          {
            id: 'y1q1-r1',
            track: 'read',
            stream: 'core',
            title: 'Karpathy Zero-to-Hero ep 1–3 (micrograd → makemore)',
            verify: 'Notebooks worked end-to-end, exercises attempted',
            hours: '12h',
            resources: [R.karpathy_z2h, R.karpathy_nanogpt],
          },
          {
            id: 'y1q1-r2',
            track: 'read',
            stream: 'systems',
            title: 'HuggingFace Ultra-Scale Playbook ch.1–3',
            verify: 'Notes on parallelism dimensions (DP/TP/PP/FSDP) in your own words',
            hours: '6h',
            resources: [R.ultrascale],
          },
          {
            id: 'y1q1-r3',
            track: 'read',
            stream: 'core',
            title: 'Read 6 papers (1 every 2 weeks)',
            body:
              'Mix: 2 inference (FA-3, EAGLE-3), 2 post-training (GRPO/Open-R1, DPO), 2 of your choice. 1-page notes each.',
            verify: '6 paper-notes files in repo',
            hours: '18h',
            resources: [R.eagle_paper, R.open_r1, R.papers_with_code],
          },
          {
            id: 'y1q1-p1',
            track: 'prep',
            stream: 'core',
            title: 'Math habit: Strang 18.065 ep 1–10',
            body: '30–60 min/day. Notes per lecture. Do at least 50% of homework problems.',
            verify: '10 lecture notes + 5+ problem sets attempted',
            hours: '30h',
            resources: [R.strang_18065],
          },
          {
            id: 'y1q1-a1',
            track: 'apply',
            stream: 'core',
            title: '5 warm 1:1 chats with frontier-lab folks',
            body:
              'Not job asks. "I am working on X, you wrote about Y, can I ask 3 questions in 20 min?" Start the network now.',
            verify: '5 calls held, notes captured',
            hours: '6h',
          },
          {
            id: 'y1q1-p2',
            track: 'prep',
            stream: 'core',
            title: 'Daily LeetCode 30min sustained',
            body: 'Do not let the muscle decay post-hire. 5 days/week.',
            verify: '90+ days of activity in NeetCode tracker',
            hours: '30h (cumulative)',
            resources: [R.neetcode],
          },
          {
            id: 'y1q1-r4',
            track: 'read',
            stream: 'research',
            title: '(Research onramp) Schulman + Foerster on doing research',
            body: 'Quick reads. The mindset distinction between engineer and researcher matters.',
            verify: 'Notes captured',
            hours: '2h',
            resources: [R.schulman_research, R.foerster_paper],
          },
        ],
        reading: [R.eleuther_math, R.weng_transformer, R.interconnects, R.import_ai],
      },
      {
        number: 18,
        title: 'Y1·Q2 — Named-feature scope + paper repro begins + first FSDP run',
        goal:
          'Named-feature scoped + 2 warm-up PRs merged. Paper reproduction started with novel-ablation hypothesis written. First multi-node FSDP run logged. Math through SVD.',
        tasks: [
          {
            id: 'y1q2-b1',
            track: 'build',
            stream: 'systems',
            title: 'OSS portfolio: 3 PRs merged across vLLM / SGLang / Triton',
            body:
              'Q2 target: 3 merged PRs in the cumulative portfolio. Mix is the point — pick from bug fixes, small features, perf tweaks, doc/test improvements that follow from real reading of the code. 50–200 LOC each. Spend the time hanging in vLLM Discord / SGLang issues / Triton GH discussions to learn maintainer preferences and pick targets that will actually land. Warm relationships matter more than LOC.',
            verify:
              '3 PRs merged across vLLM / SGLang / Triton; PR list committed to private tracker with LOC + reviewer for each',
            hours: '40h',
            resources: [R.vllm_repo, R.vllm_docs, R.vllm_blog, R.sglang_docs, R.triton_docs],
          },
          {
            id: 'y1q2-b2',
            track: 'build',
            stream: 'systems',
            title: 'Paper reproduction started — design the novel-ablation upfront',
            body:
              'Pick from EAGLE-2/3, Medusa, FlashDecoding, or any 2024-2025 inference paper. Public repo. Critically: BEFORE you start coding, write down the ablation you will run that the paper did NOT (e.g., the technique on a new model size, with a different KV layout, under a different memory regime). A vanilla repro is noise; a repro + one honest ablation is signal.',
            verify:
              'Repo created; baseline runs; design doc committed AND includes a written novel-ablation hypothesis',
            hours: '20h',
            resources: [R.eagle_paper, R.papers_with_code, R.lucidrains],
          },
          {
            id: 'y1q2-b3',
            track: 'build',
            stream: 'core',
            title: 'Blog post 1 — "Three matmuls, three DSLs" writeup',
            body:
              'Convert the Capstone-2 POSTMORTEM into a public blog post. First post lowers the activation energy for the next ones.',
            verify: 'Live on personal site',
            hours: '6h',
          },
          {
            id: 'y1q2-b4',
            track: 'build',
            stream: 'systems',
            title: 'Multi-node FSDP training run on 8×H100 (rented)',
            body:
              'Rent 8×H100 on Lambda / RunPod / Voltage Park (~$24/hr × 24h ≈ $200). Run nanoGPT or a small (~1B) Llama variant under FSDP + sequence parallelism. The deliverable is not the model — it is the LOG: NCCL config you fought, the first hang you debugged, the throughput numbers, the loss curve. This converts "I read about FSDP" → "I have debugged an FSDP hang." Mandatory before Y3 elite-lab loops.',
            verify:
              'Public repo with: training script, NCCL/launcher config, throughput numbers, loss curve, 1-page debugging log of what broke and how you fixed it',
            hours: '20h',
            resources: [R.ultrascale, R.stas_book, R.weng_train_large, R.nccl_internals],
          },
          {
            id: 'y1q2-r1',
            track: 'read',
            stream: 'systems',
            title: 'Simon Boehm CUDA matmul (deep re-read) + Annotated Transformer',
            verify:
              'Boehm: implement one of his stages from scratch. Annotated Transformer: notebook runs.',
            hours: '10h',
            resources: [R.siboehm_matmul, R.annotated_transformer],
          },
          {
            id: 'y1q2-r2',
            track: 'read',
            stream: 'systems',
            title: 'vLLM design docs + PagedAttention paper deep read',
            verify: 'Notes on continuous batching + paged attention internals',
            hours: '5h',
            resources: [R.vllm_blog, R.paged_attention],
          },
          {
            id: 'y1q2-p1',
            track: 'prep',
            stream: 'core',
            title: 'Math: Strang 18.065 ep 11–20 (SVD + applications)',
            verify: 'Lecture notes + at least 5 hw problems',
            hours: '25h',
            resources: [R.strang_18065],
          },
          {
            id: 'y1q2-r3',
            track: 'read',
            stream: 'core',
            title: 'Karpathy Zero-to-Hero ep 4–6 (build GPT)',
            verify: 'nanoGPT trained from scratch on tinyshakespeare',
            hours: '12h',
            resources: [R.karpathy_z2h, R.karpathy_nanogpt],
          },
          {
            id: 'y1q2-a1',
            track: 'apply',
            stream: 'core',
            title: '5 more frontier-lab 1:1s + book NeurIPS/MLSys/GTC ticket',
            body:
              'Conferences in person: highest leverage networking event you can do. Book 6 months in advance.',
            verify: '5 calls + 1 conference ticket booked',
            hours: '8h',
          },
          {
            id: 'y1q2-r4',
            track: 'read',
            stream: 'research',
            title: '(Research onramp) RLHF Book ch.1–4',
            verify: 'Notes captured',
            hours: '4h',
            resources: [R.rlhf_book],
          },
        ],
        reading: [R.alignment_handbook, R.raschka_blog, R.hao_ai],
      },
      {
        number: 19,
        title: 'Y1·Q3 — Calculus + matrix calc + paper repro shipped + named feature in flight',
        goal:
          'Backprop derivable cold in 20 min. Paper reproduction shipped WITH the novel ablation. Named vLLM feature in active review.',
        tasks: [
          {
            id: 'y1q3-b1',
            track: 'build',
            stream: 'systems',
            title: 'OSS portfolio: 3 more PRs + the one that ships a measured perf improvement',
            body:
              'Q3 target: cumulative 6 merged PRs, with one of them being a perf-impact PR — a kernel tweak, scheduler change, prefix-cache improvement, or attention backend tuning that ships a measured improvement (latency, throughput, memory). Bring NCU / benchmark numbers into the PR description. The perf PR is the one that gets cited by maintainers; that is what makes the portfolio a signal instead of activity.',
            verify:
              '6 merged PRs cumulative across vLLM / SGLang / Triton; one of them includes before/after benchmarks in the PR description and has at least one substantive maintainer comment on the perf claim',
            hours: '40h',
            resources: [R.vllm_repo, R.sglang_docs, R.triton_docs],
          },
          {
            id: 'y1q3-b2',
            track: 'build',
            stream: 'systems',
            title: 'Paper reproduction shipped public + novel-ablation writeup',
            body:
              '~2000-word blog post. What the paper claims, what you reproduced, the novel ablation you ran, what surprised you. The ablation is the whole point — vanilla reproductions are noise.',
            verify:
              'Repo public; blog post live; results match within published tolerance; ablation results are NEW (not in the original paper)',
            hours: '25h',
          },
          {
            id: 'y1q3-r1',
            track: 'read',
            stream: 'core',
            title: 'Matrix Calculus for DL (Parr & Howard) + Khan multivariable',
            verify: 'Can derive backprop through 2-layer MLP cold in 20 minutes, twice',
            hours: '15h',
            resources: [R.matrix_calculus, R.khan_multivar, R.threeB1B_calc],
          },
          {
            id: 'y1q3-r2',
            track: 'read',
            stream: 'core',
            title: 'Karpathy zero-to-hero ep 7+ (GPT-2 reproduction in nanoGPT)',
            body: 'This is the canonical "I can read a paper and produce working code" demonstration.',
            verify: 'Reproduce GPT-2 124M training to within published loss',
            hours: '20h',
            resources: [R.karpathy_z2h, R.karpathy_nanogpt, R.karpathy_llmc],
          },
          {
            id: 'y1q3-r3',
            track: 'read',
            stream: 'systems',
            title: 'Stas Bekman ML Engineering Open Book — training-at-scale debugging',
            verify: 'Notes on FSDP failure modes + NCCL hangs',
            hours: '8h',
            resources: [R.stas_book, R.ultrascale],
          },
          {
            id: 'y1q3-r4',
            track: 'read',
            stream: 'systems',
            title: 'Horace He brrrr (re-read) + Hopper whitepaper',
            verify: 'Mental model: which roofline does each kernel hit?',
            hours: '6h',
            resources: [R.horace_brrr, R.hopper_whitepaper, R.chips_cheese],
          },
          {
            id: 'y1q3-p1',
            track: 'prep',
            stream: 'core',
            title: 'Backprop whiteboard drills (5 sessions)',
            body:
              'Cold derivation of gradient through 2-layer MLP in 20 min, video yourself, fix mistakes.',
            verify: '5 recorded sessions, errors logged and fixed',
            hours: '8h',
          },
          {
            id: 'y1q3-a1',
            track: 'apply',
            stream: 'core',
            title: 'Attend NeurIPS / MLSys / GTC OR submit a meetup talk',
            body:
              'In person if at all possible — that is what makes it networking and not Zoom. If you cannot travel, submit a Bangalore/Hyderabad meetup talk on Capstone-2.',
            verify: 'Conference attended OR talk delivered',
            hours: '20h',
          },
          {
            id: 'y1q3-r5',
            track: 'read',
            stream: 'research',
            title: '(Research onramp) Neel Nanda — TransformerLens getting started',
            verify: 'Notebook exercises completed',
            hours: '8h',
            resources: [R.nanda_interp, R.anthropic_interp],
          },
        ],
        reading: [R.weng_train_large, R.interconnects, R.dwarkesh],
      },
      {
        number: 20,
        title: 'Y1·Q4 — Senior IC review + Y1 retrospective',
        goal:
          '5–10 OSS PRs total across vLLM / SGLang / Triton, ≥1 cited by maintainers. Senior IC at new company. 3 deep blog posts up. Y1 retro doc + Y2 plan written.',
        tasks: [
          {
            id: 'y1q4-c1',
            track: 'read',
            stream: 'core',
            title: 'Curriculum Review — refresh Year 2 plan',
            body:
              'Year-end audit of the next year\'s tasks. (a) OSS targets: still alive? maintainer health? (b) Papers cited in Y2: current SOTA or superseded? (c) Lab hiring formats — same loops, same teams, same locations? (d) Replace any fast-decay items in W21–W24. Bedrock domains do not need refresh; only verify they are still the right anchors. Log replacements.',
            verify: 'Y2 review doc in /atlas-plan-changelog.md; ≥3 fast-decay items replaced or confirmed-current',
            hours: '2h',
          },
          {
            id: 'y1q4-b1',
            track: 'build',
            stream: 'systems',
            title: 'OSS portfolio shipped: 5–10 PRs total + ≥1 cited by maintainers',
            body:
              'End-of-year line. Cumulative 5–10 merged PRs across vLLM / SGLang / Triton. AT LEAST ONE perf-impact PR cited by maintainers — by name in a release note, in a maintainer-authored design doc, or in a PR description as the source of a benchmark improvement. Citation is the bar; PR count is not. Use Q4 to push the strongest perf PR over the line and to ask the reviewer for an explicit citation if it landed but went unnamed.',
            verify:
              '5–10 PRs merged across vLLM / SGLang / Triton; ≥1 PR cited by a maintainer (release notes / design doc / PR thread quote); private tracker has the citation links',
            hours: '40h',
            resources: [R.vllm_repo, R.sglang_docs, R.triton_docs],
          },
          {
            id: 'y1q4-b2',
            track: 'build',
            stream: 'core',
            title: 'Blog post 3 — go for HN front page',
            body:
              'Pick a topic where you have become genuinely expert (e.g., "How vLLM\'s prefix radix actually works"). Aim to be the canonical reference for one narrow topic.',
            verify: 'Live on site; ≥10k views or ≥1 community discussion thread',
            hours: '15h',
          },
          {
            id: 'y1q4-b3',
            track: 'build',
            stream: 'core',
            title: 'Year-1 retrospective doc + Year-2 plan',
            body:
              'What advanced. What did not. Math gap closed? OSS visibility? Network growth? Decision: stay current company or jump for exposure (NVIDIA Bangalore, Anthropic Bengaluru, training-shop)?',
            verify: 'Doc committed to private tracker; decision made',
            hours: '6h',
          },
          {
            id: 'y1q4-a1',
            track: 'apply',
            stream: 'core',
            title: 'Senior IC review passed (or scheduled)',
            verify: 'Promotion locked in or on calendar',
            hours: '6h',
          },
          {
            id: 'y1q4-r1',
            track: 'read',
            stream: 'core',
            title: 'Boyd Convex Optimization ch.1–5 (skim) + Distill momentum',
            verify: 'Notes on duality + gradient methods',
            hours: '15h',
            resources: [R.boyd_optim, R.ruder_grad, R.distill_momentum],
          },
          {
            id: 'y1q4-r2',
            track: 'read',
            stream: 'systems',
            title: 'vLLM full codebase tour — pick one subsystem to truly understand',
            body:
              'Scheduler, paged attention, prefix radix, speculative decoding — pick one. Be the team-internal expert on it.',
            verify: 'Internal notes / blog post draft on that subsystem',
            hours: '12h',
            resources: [R.vllm_repo, R.vllm_blog],
          },
          {
            id: 'y1q4-a2',
            track: 'apply',
            stream: 'core',
            title: '5 more frontier-lab 1:1s; identify 3 names willing to refer',
            body:
              'By end of Y1 you should know which 3 people would say "yes" to a referral request in Y3. Track them.',
            verify: '5 calls + private list of 3 likely referrers',
            hours: '8h',
          },
          {
            id: 'y1q4-p1',
            track: 'prep',
            stream: 'core',
            title: '1 mock interview (paper discussion + ML implementation)',
            body:
              'With a friend or someone from your 1:1 list. Pick a 2024-2025 paper. Practice critique-able discussion.',
            verify: 'Interview held + post-mortem written',
            hours: '4h',
            resources: [R.sundeep_interview],
          },
          {
            id: 'y1q4-r3',
            track: 'read',
            stream: 'research',
            title: '(Research onramp) ARENA chapter 1 OR Spinning Up ch.1–3',
            verify: 'Notebook(s) worked end-to-end',
            hours: '12h',
            resources: [R.arena, R.spinning_up],
          },
        ],
        reading: [R.ed_yang_torch, R.ed_yang_podcast, R.chip_huyen_design, R.weng_blog],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // YEAR 2 — Bridge artifacts
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'phase-7',
    title: 'Phase 7 — Year 2 · Bridge artifacts',
    blurb:
      'Subsystem ownership in vLLM/sglang/Triton + workshop paper or arXiv preprint + community-reference blog post. Pick one deep direction.',
    year: 2,
    cadence: 'quarter',
    color: 'var(--m-track-edge-ai)',
    artifact:
      'Owner of a named subsystem in vLLM/sglang/Triton (cited by maintainers as the go-to person for it) · 1 workshop paper or arXiv preprint with novel ablations · 1 community-reference blog post (cited by an arXiv paper or linked from a project doc) · Staff-IC track or external move',
    context:
      'Year 2 is the bridge. Frontier labs filter on "can you reason about the model, not just plumbing around it". Two artifacts close the gap to elite-lab interviews: subsystem ownership in vLLM/sglang/Triton (you are the named expert on prefix-radix / scheduler / paged-attention / a model port — measurable as: maintainers tag you in related issues), OR a workshop paper/arXiv preprint with novel ablations. Pick one deep direction this year — chasing both spreads you thin. Default systems-deep; choose research-fork only if Y1 math + research onramps lit you up genuinely (paper-reading became fun, not chore). The "Top-50 contributor" framing was retired — it is gameable, dominated by full-timers at vendors, and does not signal what hiring managers actually want (depth on one subsystem, not breadth across many PRs).',
    weeks: [
      {
        number: 21,
        title: 'Y2·Q1 — Pick a deep direction',
        goal:
          'Decision committed: systems-deep OR research-fork. Visibly working toward chosen artifact. Mentors identified.',
        tasks: [
          {
            id: 'y2q1-b1',
            track: 'build',
            stream: 'core',
            title: 'Direction-decision doc committed',
            body:
              'Sections: which fork (systems-deep / research-fork), why this and not the other, what you give up, what the artifact looks like in 9 months. Circulate to 2 mentors for feedback.',
            verify: 'Doc committed; 2 mentor reviews logged',
            hours: '6h',
          },
          {
            id: 'y2q1-b2',
            track: 'build',
            stream: 'systems',
            title: '3+ substantial vLLM/sglang PRs (visible-feature work, no docs)',
            verify: '3 merged; 2+ touch core scheduling/perf code',
            hours: '40h',
            resources: [R.vllm_repo, R.sglang_docs],
          },
          {
            id: 'y2q1-b3',
            track: 'build',
            stream: 'research',
            title: '(Research-fork only) Deep-dive into chosen subfield',
            body:
              'Pick: mech interp / alignment / post-training / RL / MoE / multimodal. One week of clearing your plate to read & think. End with a doc: open problems, who is working on what.',
            verify: 'Subfield brief committed (5–10 pages)',
            hours: '30h',
            resources: [R.nanda_interp, R.nanda_200, R.arena, R.rlhf_book, R.spinning_up],
          },
          {
            id: 'y2q1-r1',
            track: 'read',
            stream: 'systems',
            title: 'MIT 6.5940 (Han Song) lectures 1–8',
            verify: 'Notes; pick one technique from the course to implement next quarter',
            hours: '20h',
            resources: [R.han_6_5940],
          },
          {
            id: 'y2q1-r2',
            track: 'read',
            stream: 'systems',
            title: 'Triton compiler internals (Tillet talks + GPU MODE)',
            body: 'Lowering pipeline: TritonGPU IR → MLIR → PTX. Read the dialect docs.',
            verify: 'Diagram of the lowering pipeline in your own notes',
            hours: '8h',
            resources: [R.gpu_mode, R.mlir_toy, R.mlir_beginners],
          },
          {
            id: 'y2q1-a1',
            track: 'apply',
            stream: 'core',
            title: 'Identify 2–3 mentors; initiate contact',
            body:
              'Vendor maintainer (vLLM/sglang/Triton), MATS alum, someone in target lab. "Mentor" can be light — quarterly 30-min check-in.',
            verify: '2–3 mentor commitments captured',
            hours: '6h',
          },
          {
            id: 'y2q1-p1',
            track: 'prep',
            stream: 'core',
            title: 'GPU MODE attendance: 1 lecture/week + 1 public question',
            verify: '12 lectures attended; 1 question publicly asked or answered',
            hours: '15h',
            resources: [R.gpu_mode],
          },
          {
            id: 'y2q1-r3',
            track: 'read',
            stream: 'research',
            title: 'Anthropic interp papers (SAE + Scaling Monosemanticity)',
            verify: 'Notes',
            hours: '6h',
            resources: [R.anthropic_interp],
          },
        ],
        reading: [R.foerster_paper, R.schulman_research, R.lucidrains, R.hao_ai],
      },
      {
        number: 22,
        title: 'Y2·Q2 — Build the bridge artifact',
        goal:
          'Bridge-artifact draft visible. First meetup talk delivered. Probability/info-theory math added.',
        tasks: [
          {
            id: 'y2q2-b1',
            track: 'build',
            stream: 'systems',
            title: '(Systems-deep) Lead one major vLLM/sglang/Triton feature',
            body:
              'Not a small PR — a feature that requires design buy-in from senior maintainers. Get 3+ maintainer reviews.',
            verify: 'Design doc + PR thread with 3+ maintainer engagements',
            hours: '60h',
            resources: [R.vllm_repo, R.sglang_docs],
          },
          {
            id: 'y2q2-b2',
            track: 'build',
            stream: 'research',
            title: '(Research-fork) Reproduce SOTA paper end-to-end',
            body:
              'Examples: GRPO on a small model, an SAE on a 1B model, EAGLE-3 from scratch. Real ablations, public repo.',
            verify: 'Repo public; results within paper tolerance OR honest negative result',
            hours: '60h',
            resources: [R.open_r1, R.anthropic_interp, R.eagle_paper, R.lucidrains],
          },
          {
            id: 'y2q2-b3',
            track: 'build',
            stream: 'core',
            title: 'Blog post 4 — write the post you wish existed when you started',
            body:
              'Aim: become the canonical reference for one narrow topic. Worth more than 5 generic posts.',
            verify: 'Live on site',
            hours: '15h',
          },
          {
            id: 'y2q2-r1',
            track: 'read',
            stream: 'systems',
            title: 'NCCL internals + Stas Bekman scaling debugging',
            verify: 'Notes on collective ops + common training failure modes',
            hours: '8h',
            resources: [R.stas_book],
          },
          {
            id: 'y2q2-r2',
            track: 'read',
            stream: 'research',
            title: 'MATS / SERI MATS lecture archive — 5 talks',
            verify: 'Notes on each',
            hours: '10h',
            resources: [R.arena],
          },
          {
            id: 'y2q2-a1',
            track: 'apply',
            stream: 'core',
            title: 'Submit a meetup / lightning-talk talk',
            body:
              'Bangalore/Hyderabad meetup, virtual GPU MODE, or NeurIPS workshop lightning. Practice ground for conference talks.',
            verify: 'Talk accepted + delivered',
            hours: '15h',
          },
          {
            id: 'y2q2-p1',
            track: 'prep',
            stream: 'core',
            title: 'MacKay info-theory ch.1–6 + Stat 110 first 10 lectures',
            body:
              'KL/entropy/MLE will come up in elite-lab loops. Probability is the most-skipped math topic.',
            verify: 'Notes; can derive cross-entropy from KL on whiteboard cold',
            hours: '20h',
            resources: [R.mackay, R.olah_info, R.stat110],
          },
        ],
        reading: [R.google_tuning, R.dwarkesh, R.raschka_blog],
      },
      {
        number: 23,
        title: 'Y2·Q3 — Bridge artifact submitted; conference attended',
        goal:
          'Workshop paper submitted OR subsystem-owner status reached on chosen OSS project. In-person at one frontier conference.',
        tasks: [
          {
            id: 'y2q3-b1',
            track: 'build',
            stream: 'research',
            title: '(Research-fork) Workshop paper / arXiv preprint submitted',
            body:
              'Targets: NeurIPS Efficient ML, MLSys, ICLR ME-FoMo, Tiny Papers. arXiv with real ablations also counts. Co-author OK.',
            verify: 'Submission link OR arXiv URL; preprint downloadable',
            hours: '60h',
            resources: [R.foerster_paper, R.schulman_research, R.google_tuning],
          },
          {
            id: 'y2q3-b2',
            track: 'build',
            stream: 'systems',
            title: '(Systems-deep) Subsystem ownership status — measurable',
            body:
              'You are the named go-to person for a subsystem (prefix-radix / scheduler / paged-attention / a model port). Measurable via: maintainers tag you in related issues; you are listed in CODEOWNERS or a project doc; you have shipped 2+ named features on this subsystem. PR count is not the metric — depth on one subsystem is.',
            verify:
              'Tagged in ≥3 maintainer-initiated issues this quarter as subsystem expert; OR added to CODEOWNERS; OR cited as expert in a release blog',
            hours: '50h',
            resources: [R.vllm_repo, R.sglang_docs],
          },
          {
            id: 'y2q3-r1',
            track: 'read',
            stream: 'systems',
            title: 'Hopper + Blackwell whitepapers (deep) + Chips and Cheese',
            verify: 'Comparative notes; understand TMA/wgmma vs Blackwell tensor-core changes',
            hours: '8h',
            resources: [R.hopper_whitepaper, R.chips_cheese],
          },
          {
            id: 'y2q3-r2',
            track: 'read',
            stream: 'research',
            title: 'Lucidrains — pick 3 implementations, read alongside their original papers',
            verify: 'Notes on what the implementation makes obvious that the paper hides',
            hours: '12h',
            resources: [R.lucidrains, R.papers_with_code],
          },
          {
            id: 'y2q3-a1',
            track: 'apply',
            stream: 'core',
            title: 'NeurIPS / MLSys / GTC in person',
            body:
              'Pre-book 1:1 coffees with at least 5 frontier-lab folks before you arrive. Conference is a coffee accelerator.',
            verify: 'Conference attended; 5+ new connections logged',
            hours: '40h',
          },
          {
            id: 'y2q3-a2',
            track: 'apply',
            stream: 'core',
            title: 'Identify 8–10 specific Y3 target roles',
            body:
              'Per role: which lab, which team, which manager, which referrer. Ranked. (Anthropic Bengaluru, DeepMind India RE, OpenAI Residency, etc.)',
            verify: 'Target-roles doc committed (private)',
            hours: '6h',
            resources: [R.sundeep_interview],
          },
          {
            id: 'y2q3-p1',
            track: 'prep',
            stream: 'core',
            title: 'Mock interview — paper discussion (use a paper read this quarter)',
            verify: 'Interview held + post-mortem',
            hours: '4h',
          },
          {
            id: 'y2q3-p2',
            track: 'prep',
            stream: 'core',
            title: 'Mock interview — ML system design (distributed training 100B)',
            verify: 'Whiteboard: DP×TP×PP, gradient accumulation, fault tolerance, checkpointing',
            hours: '4h',
            resources: [R.ultrascale, R.weng_train_large, R.chip_huyen_design],
          },
        ],
        reading: [R.foerster_paper, R.import_ai, R.interconnects],
      },
      {
        number: 24,
        title: 'Y2·Q4 — Y2 retrospective + Y3 calendar built',
        goal:
          'Retrospective written. Y3 application calendar built. References lined up. Portfolio site shipped.',
        tasks: [
          {
            id: 'y2q4-c1',
            track: 'read',
            stream: 'core',
            title: 'Curriculum Review — final refresh before elite-lab push',
            body:
              'Hardest review: Y3 is application + interview, so the lab landscape needs to be current. (a) Verify lab targets: hiring? location? team alive? (b) Verify interview formats: any lab changed loops or rounds? (c) Refresh papers in the paper-discussion grid — past 24 months\' big releases. (d) Replace any fast-decay resources in W25–W28. (e) Update LIVING_LAYER subscriptions if any have stopped publishing.',
            verify: 'Y3 review doc + lab-landscape map committed to /atlas-plan-changelog.md',
            hours: '3h',
          },
          {
            id: 'y2q4-b1',
            track: 'build',
            stream: 'core',
            title: 'Portfolio site shipped (single-page Karpathy-style)',
            body:
              'Project cards: title, 2-line description, code link + writeup link. Top: OSS / independent research section. No fluff. No tracking. Domain you own.',
            verify: 'Site loads on custom domain; 4–5 pinned artifacts',
            hours: '12h',
          },
          {
            id: 'y2q4-b2',
            track: 'build',
            stream: 'core',
            title: 'Bridge artifact final polish (paper revision OR major OSS feature shipped)',
            verify: 'Paper revised + resubmitted, OR feature shipped behind a flag in vLLM/sglang main',
            hours: '30h',
          },
          {
            id: 'y2q4-b3',
            track: 'build',
            stream: 'core',
            title: 'Y2 retrospective + gap analysis',
            body:
              'Sections: artifacts shipped, network growth, math/research depth, open gaps, Y3 plan. Be brutal.',
            verify: 'Doc committed',
            hours: '4h',
          },
          {
            id: 'y2q4-a1',
            track: 'apply',
            stream: 'core',
            title: '8–10 specific Y3 target roles, per-role notes',
            verify: 'Target-roles doc finalized; per-role primer drafted',
            hours: '8h',
          },
          {
            id: 'y2q4-a2',
            track: 'apply',
            stream: 'core',
            title: 'References lined up: 2 strong + 1 lab-respected',
            body:
              'Ask permission. The lab-respected reference is the most valuable — a vLLM maintainer, an MLSys-recognized name. Without one, you are at the cold-app baseline.',
            verify: '3 confirmations; reference brief sent',
            hours: '6h',
          },
          {
            id: 'y2q4-r1',
            track: 'read',
            stream: 'core',
            title: 'Lilian Weng full archive (skim; deep-read 3)',
            verify: 'Notes on 3 deep reads',
            hours: '6h',
            resources: [R.weng_blog],
          },
          {
            id: 'y2q4-r2',
            track: 'read',
            stream: 'systems',
            title:
              'vLLM advanced: chunked prefill + disaggregated + prefix radix + spec decoding integrations',
            verify: 'Per-feature notes; understand the perf tradeoffs',
            hours: '8h',
            resources: [R.vllm_blog, R.hao_ai, R.mosaic_kv, R.mosaic_inference],
          },
          {
            id: 'y2q4-p1',
            track: 'prep',
            stream: 'core',
            title: 'Mock CodeSignal-style 90-min coding (Anthropic-style, 100% accuracy target)',
            body:
              'In-memory database, banking system — that style, NOT LeetCode. Anthropic uses CodeSignal at the loop entry; reportedly requires 100% accuracy.',
            verify: 'Two timed sessions; 100% on second',
            hours: '6h',
          },
          {
            id: 'y2q4-p2',
            track: 'prep',
            stream: 'core',
            title: 'Anthropic ethics-round prep: write your AI safety position, rehearse',
            body:
              'AISF curriculum is the public reference. You need a coherent, examined view — "I just want to build cool stuff" is a reject signal.',
            verify: '500-word position doc committed; rehearsed twice with someone',
            hours: '8h',
            resources: [R.aisf],
          },
        ],
        reading: [R.sundeep_interview, R.dwarkesh],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // YEAR 3 — Elite-lab push
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'phase-8',
    title: 'Phase 8 — Year 3 · Elite-lab push',
    blurb:
      'Apply, interview, decide. Highest-probability targets: Anthropic Bengaluru → MTS-Eng track, DeepMind India RE, OpenAI Residency.',
    year: 3,
    cadence: 'quarter',
    color: 'color-mix(in srgb, var(--m-terracotta) 78%, #b03a30 22%)',
    artifact: 'One offer from a Tier-1 lab OR a clear Year-4 plan with concrete loop feedback',
    context:
      'Year 3 is when you actually apply. The brutal math: cold applications fail, warm + real artifacts succeed. Highest-probability targets in order: Anthropic Bengaluru (Inference/Infra → MTS-Eng), DeepMind India RE (MLO team in Bangalore), OpenAI Residency (single best non-PhD wedge). Stretch: Cohere, xAI, Mistral, FAIR. Closed without PhD: Research Scientist anywhere. Do NOT apply broadly to elite labs without warm intros — you burn names. Math whiteboard practice + paper-discussion practice are the highest-leverage daily habits.',
    weeks: [
      {
        number: 25,
        title: 'Y3·Q1 — Application opener (warm intros only)',
        goal:
          'First batch sent (5–7 elite-lab apps), all with warm intros. Daily math + ML implementation drills running.',
        tasks: [
          {
            id: 'y3q1-prereq',
            track: 'prep',
            stream: 'core',
            title: 'Prerequisites — verify before Y3 elite-lab push',
            body:
              'You\'re about to send applications to Anthropic / OpenAI / DeepMind / similar. The bar at the loop is formal, not vibes. Verify cold:\n' +
              '  • Math: derive backprop for one MLP layer; softmax Jacobian; KL divergence; SGD convergence sketch\n' +
              '  • Implement-from-scratch: can you write attention(Q,K,V) + a causal mask + KV cache in 30 min from a blank file?\n' +
              '  • Paper-reading: 3-pass routine running; last 5 papers logged with one novel ablation idea each\n' +
              '  • Coding: CodeSignal-style 90-min session at 100% accuracy (not LeetCode)\n' +
              '  • AI safety: a 500-word position you\'ve rehearsed (Anthropic-style ethics round)\n' +
              'If any reflex is rusty: Karpathy Z2H ep 1-4 (re-watch), Math4ML targeted, 3 papers in 1 sitting with the 3-pass method. Reds here are the difference between rejected-at-screen and on-site invite — DO NOT skip.',
            verify: 'Self-check entry in weekly log; reds remediated before y3q1-a1 submission goes out',
            hours: '1h check + variable remediation in flight',
            resources: [R.karpathy_z2h, R.threeB1B_linalg, R.cs6120],
          },
          {
            id: 'y3q1-a1',
            track: 'apply',
            stream: 'core',
            title: 'Anthropic Bengaluru — Inference / Infra application via referral',
            body:
              'Resume + cover (200 words max). Highlight fused-rmsnorm-mm + ROOFLINE.md, kernels-3-ways, OSS PR portfolio (vLLM/SGLang/Triton with cited perf PR), bridge artifact. Anthropic explicitly favors non-PhD with strong artifacts.',
            verify: 'Application submitted via referral',
            hours: '6h',
          },
          {
            id: 'y3q1-a2',
            track: 'apply',
            stream: 'core',
            title: 'DeepMind India RE — application via referral',
            body:
              'Bangalore MLO team. Same package. DeepMind quiz round is brutal — math whiteboard prep is non-negotiable.',
            verify: 'Application submitted',
            hours: '4h',
          },
          {
            id: 'y3q1-a3',
            track: 'apply',
            stream: 'core',
            title: 'OpenAI Residency application',
            body:
              'Time the application window. Single best non-PhD wedge into OpenAI. 6 months, ~$220K, high conversion to FT.',
            verify: 'Application submitted in window',
            hours: '6h',
          },
          {
            id: 'y3q1-a4',
            track: 'apply',
            stream: 'core',
            title: '2–3 stretch apps (Cohere / xAI inference / Mistral / FAIR)',
            body: 'Referrals where possible. xAI hires fastest; Mistral is EU-biased.',
            verify: '2–3 applications submitted',
            hours: '6h',
          },
          {
            id: 'y3q1-p1',
            track: 'prep',
            stream: 'core',
            title: 'Daily math whiteboard practice (45 days)',
            body:
              'Eigenvalues, rank, SVD, Jacobian, KL — formal definitions, derivations cold. DeepMind quiz round filters on this.',
            verify: '45 daily sessions logged',
            hours: '30h',
            resources: [R.strang_18065, R.matrix_calculus, R.mackay],
          },
          {
            id: 'y3q1-p2',
            track: 'prep',
            stream: 'core',
            title: 'Daily ML implementation drills',
            body:
              'Transformer / multi-head attention / KV cache / beam search / top-p sampling on whiteboard cold. Tensor-shape discipline is the most common failure mode.',
            verify:
              '20 implementations cleanly executed (timed); attention from scratch in 30 min',
            hours: '20h',
            resources: [R.annotated_transformer, R.karpathy_z2h],
          },
          {
            id: 'y3q1-p3',
            track: 'prep',
            stream: 'core',
            title: '2 mock interviews per week (paper + system design + coding)',
            verify: '24 mocks logged with post-mortems',
            hours: '40h',
            resources: [R.sundeep_interview, R.chip_huyen_design],
          },
          {
            id: 'y3q1-r1',
            track: 'read',
            stream: 'core',
            title: 'Re-read all candidate papers for paper-discussion rounds',
            body:
              'Past 24 months of big releases per target lab. Anthropic: Claude papers + interp. OpenAI: GPT-4 / o1 / o3 / RLHF. DeepMind: Gemini / AlphaProof / SIMA.',
            verify: 'Paper-grid: 12+ papers, 1-page critique each',
            hours: '24h',
          },
        ],
      },
      {
        number: 26,
        title: 'Y3·Q2 — Interview loops + iteration',
        goal:
          'Active loops at 2–3 labs. Per-loop primers. Second batch sent. Weak rounds re-prepared.',
        tasks: [
          {
            id: 'y3q2-a1',
            track: 'apply',
            stream: 'core',
            title: 'Active interview loops at 2–3 labs',
            verify: 'Calendar: scheduled rounds across loops',
            hours: '40h (cumulative, across loops)',
          },
          {
            id: 'y3q2-b1',
            track: 'build',
            stream: 'core',
            title: 'Per-loop primer doc (1 per active lab)',
            body: 'What they ship, who interviews, likely topics, likely papers, behavioral angles.',
            verify: '1 doc per active loop',
            hours: '10h',
          },
          {
            id: 'y3q2-a2',
            track: 'apply',
            stream: 'core',
            title: 'Second-batch applications (5+)',
            body:
              'Adjacent companies (NVIDIA AI Inference Bangalore, Together, Modal, fal.ai, Cerebras) — these are credible career stops AND interview practice.',
            verify: '5+ applications submitted',
            hours: '8h',
          },
          {
            id: 'y3q2-p1',
            track: 'prep',
            stream: 'core',
            title: 'Per-loop targeted prep (math gaps, sys-design topics, paper sets)',
            body: 'After each round, write what you bombed and study that.',
            verify: 'Post-mortem after every round; gaps logged + re-studied',
            hours: '30h',
          },
          {
            id: 'y3q2-p2',
            track: 'prep',
            stream: 'core',
            title: 'Behavioral / STAR + Anthropic ethics rehearsed',
            verify: '6 STAR stories + ethics position polished, rehearsed live twice',
            hours: '8h',
            resources: [R.aisf],
          },
          {
            id: 'y3q2-b2',
            track: 'build',
            stream: 'systems',
            title: 'Keep shipping — do not go silent during apps',
            body:
              'OSS PRs continue. Recruiters check the contributor graph during the loop. A 6-month gap looks bad.',
            verify: '4+ vLLM/sglang PRs during the quarter',
            hours: '20h',
            resources: [R.vllm_repo],
          },
        ],
      },
      {
        number: 27,
        title: 'Y3·Q3 — Decision quarter',
        goal:
          'Offers in hand OR concrete feedback for Y4 course-correction. Negotiations underway. Reference checks closed.',
        tasks: [
          {
            id: 'y3q3-a1',
            track: 'apply',
            stream: 'core',
            title: 'Negotiate offers (or schedule reapplications based on feedback)',
            body:
              'Levels.fyi data; comp ranges. Anthropic MTS median ~$545K, OpenAI Research ~$1.5M+ (US). India offers will be lower; relocation/sponsorship matters. Negotiate base/equity/signing/relocation separately.',
            verify: 'Offer letter(s) reviewed against Levels.fyi data',
            hours: '20h',
          },
          {
            id: 'y3q3-a2',
            track: 'apply',
            stream: 'core',
            title: 'Reference checks complete',
            verify: 'References completed for any active offers',
            hours: '4h',
          },
          {
            id: 'y3q3-b1',
            track: 'build',
            stream: 'core',
            title: 'If no offers: per-loop post-mortems + Y4 push plan',
            body:
              'Each rejection gets one short doc: which round, what went wrong, what to fix. Identify the 1–2 gaps and plan a 6-month push.',
            verify: 'Post-mortems written; Y4 plan committed',
            hours: '8h',
          },
          {
            id: 'y3q3-a3',
            track: 'apply',
            stream: 'core',
            title: 'Continue OSS + blog cadence; do not slow down',
            verify: 'No 4-week gap on contributor graph or blog',
            hours: '20h',
          },
        ],
      },
      {
        number: 28,
        title: 'Y3·Q4 — Land + transition (or pivot to Y4)',
        goal:
          'Accept offer OR pivot to Y4 plan. Either way, you are in the field for good. Final retro on the 3-year arc.',
        tasks: [
          {
            id: 'y3q4-a1',
            track: 'apply',
            stream: 'core',
            title: 'Accept best offer',
            verify: 'Offer accepted, signed',
            hours: '4h',
          },
          {
            id: 'y3q4-a2',
            track: 'apply',
            stream: 'core',
            title: 'Notice + clean offboard at current company',
            body:
              'Two weeks minimum, clean handoff doc, references intact. The vendor maintainer of the OSS project is your best long-term reference — preserve that relationship through the transition.',
            verify: 'Notice given, handoff doc shared, exit clean',
            hours: '20h',
          },
          {
            id: 'y3q4-a3',
            track: 'apply',
            stream: 'core',
            title: 'Logistics — visa, relocation, paperwork',
            body:
              'Visa/sponsorship paperwork (Deloitte handles for DeepMind London; varies by company). Spousal/family considerations. Tax implications.',
            verify: 'Visa filed, relocation booked',
            hours: '40h',
          },
          {
            id: 'y3q4-b1',
            track: 'build',
            stream: 'core',
            title: 'Final retrospective on the 3-year arc',
            body:
              'What worked, what did not, what you would tell your past self. Useful for you; useful as a public post; the "I did the transition, here is what I learned" post is one of the highest-signal things you can publish.',
            verify: 'Retro doc written; public post drafted',
            hours: '12h',
          },
          {
            id: 'y3q4-r1',
            track: 'read',
            stream: 'core',
            title: 'Read into your new team\'s codebase before day 1',
            body:
              'If at Anthropic: Claude internals docs, MTS handbook. If at vLLM-team: their advanced tickets. Hit the ground running.',
            verify: 'First-week-onboarding plan written',
            hours: '15h',
          },
        ],
      },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────
// Helpers used by the Atlas UI.
// ────────────────────────────────────────────────────────────────────────

export function allTasks(): Task[] {
  return PATH.flatMap((p) => p.weeks.flatMap((w) => w.tasks))
}

export function getWeek(num: number): { phase: Phase; week: Week } | null {
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      if (week.number === num) return { phase, week }
    }
  }
  return null
}

export function totalTasks(): number {
  return allTasks().length
}

export function maxWeek(): number {
  return Math.max(...PATH.flatMap((p) => p.weeks.map((w) => w.number)))
}

/**
 * Display label for a period. Year 0 → "W3"; Year 1+ → "Y1·Q2".
 */
export function periodLabel(phase: Phase, week: Week): string {
  if (phase.cadence === 'week') return `W${week.number}`
  const idx = phase.weeks.findIndex((w) => w.number === week.number)
  return `Y${phase.year}·Q${idx + 1}`
}

export function periodLabelByNumber(num: number): string {
  const ctx = getWeek(num)
  if (!ctx) return `W${num}`
  return periodLabel(ctx.phase, ctx.week)
}

/**
 * Group periods by year for spine rendering.
 */
export type YearGroup = { year: 0 | 1 | 2 | 3; cadence: Cadence; weeks: { phase: Phase; week: Week }[] }

export function groupedByYear(): YearGroup[] {
  const map = new Map<number, YearGroup>()
  for (const phase of PATH) {
    let g = map.get(phase.year)
    if (!g) {
      g = { year: phase.year, cadence: phase.cadence, weeks: [] }
      map.set(phase.year, g)
    }
    for (const week of phase.weeks) g.weeks.push({ phase, week })
  }
  return Array.from(map.values()).sort((a, b) => a.year - b.year)
}

/**
 * Track / Stream metadata used by the UI.
 */
export const TRACK_LABELS: Record<Track, string> = {
  read: 'Read',
  build: 'Build',
  apply: 'Apply',
  prep: 'Prep',
}

export const STREAM_LABELS: Record<Stream, string> = {
  core: 'Core',
  systems: 'Systems',
  research: 'Research',
}

export const RESOURCE_KIND_LABEL: Record<ResourceKind, string> = {
  paper: 'paper',
  book: 'book',
  video: 'video',
  course: 'course',
  docs: 'docs',
  blog: 'blog',
  repo: 'repo',
  tool: 'tool',
  mosaic: 'mosaic',
}

export const HALFLIFE_LABEL: Record<HalfLife, string> = {
  durable: 'durable',
  medium: 'medium',
  fast: 'fast — verify',
}

// ────────────────────────────────────────────────────────────────────────
// Span helpers — map (period number 0..28) ↔ global week (0..MAX_GLOBAL_WEEK).
// The global spine is one continuous sequence. Year 0 = 1 wk per period;
// Year 1+ quarters = 13 wk per period. Total: 17 + 12*13 = 173 weeks (W0..W172).
// ────────────────────────────────────────────────────────────────────────

let _spanMap: Map<number, [number, number]> | null = null

function buildSpanMap(): Map<number, [number, number]> {
  if (_spanMap) return _spanMap
  const m = new Map<number, [number, number]>()
  let cursor = 0
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      const span = periodWeeks(phase.cadence)
      m.set(week.number, [cursor, cursor + span - 1])
      cursor += span
    }
  }
  _spanMap = m
  return m
}

/** Inclusive [start, end] global-week range for a period. */
export function periodSpan(periodNumber: number): [number, number] {
  return buildSpanMap().get(periodNumber) ?? [0, 0]
}

/** Maximum global week index in the spine. */
export function maxGlobalWeek(): number {
  let last = 0
  buildSpanMap().forEach(([, end]) => {
    if (end > last) last = end
  })
  return last
}

/** Total number of global weeks (= maxGlobalWeek + 1). */
export function totalGlobalWeeks(): number {
  return maxGlobalWeek() + 1
}

/** Resolve which (phase, period) a given global week falls into. */
export function periodAtGlobalWeek(g: number): { phase: Phase; week: Week } | null {
  const spans = buildSpanMap()
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      const span = spans.get(week.number)
      if (span && g >= span[0] && g <= span[1]) return { phase, week }
    }
  }
  return null
}

/** Index within phase (0-based) of a given period — useful for "Q1/Q2/..." labels. */
export function periodIndexInPhase(phase: Phase, week: Week): number {
  return phase.weeks.findIndex((w) => w.number === week.number)
}

// ────────────────────────────────────────────────────────────────────────
// BEDROCK_DOMAINS — the immutable spine.
// These twelve domains have ~10y+ half-lives. Frameworks rotate; bedrock
// does not. The Year 0 sprint should over-index here. When a Curriculum
// Review surfaces decay in the framework layer, the bedrock is what
// remains true and what you re-anchor on.
// ────────────────────────────────────────────────────────────────────────

export type BedrockDomain = {
  title: string
  why: string
  anchors: string[] // resource ids (lookup against R if needed) or short notes
}

export const BEDROCK_DOMAINS: BedrockDomain[] = [
  {
    title: 'Math — LinAlg through SVD; Calc through backprop; Probability through KL/MLE; Convex optim through duality',
    why: 'The silent killer at elite-lab quiz rounds. 30–60 min/day until formal definitions are reflexive. Half-life: forever.',
    anchors: ['Strang 18.065', '3B1B LinAlg & Calc', 'Parr & Howard Matrix Calculus', 'MacKay (info theory)', 'Boyd (convex optim)', 'Stat 110 (Blitzstein)'],
  },
  {
    title: 'C/C++ memory model + cache lines + atomics',
    why: 'CUDA C++ is C++. Every kernel touches this. Memory ordering rules (acq/rel/relaxed) are durable across decades.',
    anchors: ['cppreference', 'Effective Modern C++ (Meyers)', 'C++ Concurrency in Action (Williams)', 'atomic<> Weapons (Sutter)', 'C++ Core Guidelines'],
  },
  {
    title: 'OS fundamentals — virtual memory, page tables, scheduling, syscalls',
    why: 'You cannot reason about pinned memory, unified-memory perf, NUMA, fork/exec overhead, or driver semantics without OS first principles. OSTEP is canonical and free.',
    anchors: ['OS Three Easy Pieces (Arpaci-Dusseau)', 'OSTEP concurrency chapters'],
  },
  {
    title: 'Computer architecture — caches, branch prediction, ILP, microarchitecture, pipelining',
    why: 'Every perf decision starts here. CSAPP for the programmer\'s perspective; Hennessy & Patterson for the quantitative discipline.',
    anchors: ['CSAPP (Bryant & O\'Hallaron)', 'Hennessy & Patterson Quantitative', 'Drepper — What Every Programmer Should Know About Memory', 'Agner Fog optimization manuals'],
  },
  {
    title: 'GPU memory hierarchy mapped to ML workloads — the bandwidth pyramid',
    why:
      'HBM → L2 → SMEM → registers, with bandwidths that span ~3 orders of magnitude. SMEM bank conflicts, L1/L2 line size, HBM bandwidth, NVLink/IB topology. You should be able to write the H100 numbers (HBM3 ≈ 3.35 TB/s, L2 ≈ 50 MB, SMEM ≈ 228 KB/SM, registers ≈ 65k/SM) from memory and reach for them whenever you reason about a kernel — most "optimizations" that work on LLM inference (especially decode at small batch) help by reducing global-memory traffic, not by reducing compute. Hardware names rotate (Hopper → Blackwell → next); the bandwidth pyramid does not.',
    anchors: ['PMPP (Hwu lectures)', 'GPU MODE community', 'Simon Boehm matmul', 'Hopper whitepaper (numbers)'],
  },
  {
    title: 'GPU compute model — warps, async pipelines, Tensor Core SHAPE constraints, occupancy',
    why:
      'Tensor Cores have rigid shape constraints (e.g., wgmma m64nNk16 for fp16/bf16, m64nNk32 for fp8 on H100). A matmul that does not match these tile dimensions falls back to CUDA cores and runs 8–16× slower — and a kernel author who cannot identify whether their code hits TC has not yet earned senior-inference-engineer status. wgmma, TMA, mbarrier — the names will keep shifting. The async + tensor-core-shape + occupancy model does not. Verify TC utilization with NCU on every kernel; never trust your eyes.',
    anchors: ['Hopper Tuning Guide', 'Hopper whitepaper (wgmma chart)', 'PTX ISA reference', 'CUTLASS CuTe primer', 'FA-3 paper', 'Nsight Compute (TC % metric)'],
  },
  {
    title: 'Roofline + arithmetic intensity — the predictive tool',
    why:
      'The diagnostic lens you reach for every time you optimize anything. The point is not citing the roofline plot in a presentation — it is using it as a working tool: given a (shape, dtype, hardware) triple, predict the regime (compute / HBM / SMEM / overhead) and the % of peak you should expect, BEFORE you profile. Then verify with NCU and explain every gap. This is the practical skill that separates senior inference engineers from intermediate ones, and it is what every real serving-team interview probes. The H100 fp16 ridge point sits around AI ≈ 295 FLOPs/byte; below that you are HBM-bound, above it you are TC-bound. Never decays.',
    anchors: ['Horace He — brrr from first principles', 'Hopper whitepaper (peak TC + HBM3)', 'NCU metrics tree', 'CUTLASS perf reports'],
  },
  {
    title: 'Compiler theory + IRs (MLIR dialects, LLVM IR, SSA, dataflow)',
    why: 'Triton, torch.compile, IREE, Pallas, Mojo all sit on this. Frameworks rotate every 2–3 years; the IR + dataflow theory does not.',
    anchors: ['Cornell CS 6120', 'MLIR Toy tutorial', 'j2kun MLIR for Beginners', 'LLVM Kaleidoscope', 'Dragon Book (selective)'],
  },
  {
    title: 'Distributed primitives — NCCL collectives, ring vs tree, gradient sync patterns',
    why: 'DP/TP/PP/FSDP/EP are recipes; the underlying collective ops + topology-aware bandwidth math is what stays true.',
    anchors: ['NCCL design docs', 'Lilian Weng — How to Train Really Large Models', 'Stas Bekman ML Engineering Open Book'],
  },
  {
    title: 'Attention as a primitive + autoregressive mechanics (KV cache, prefill/decode, online softmax)',
    why: 'Architectures change (MHA → GQA → MLA → ?). The attention primitive + autoregressive decoding pipeline keeps showing up.',
    anchors: ['Attention Is All You Need', 'Annotated Transformer', 'PagedAttention paper'],
  },
  {
    title: 'Backprop + autograd internals (PyTorch dispatcher, custom autograd, AOT vs eager)',
    why: 'Required to reason about training systems. The dispatcher pattern is durable across PT versions.',
    anchors: ['Karpathy Zero-to-Hero', 'Edward Yang — PyTorch Internals', 'PyTorch Dev Podcast'],
  },
  {
    title: 'Paper-reading + experimentation methodology + scaling laws',
    why: 'Schulman + Foerster + Tuning Playbook. The discipline that separates engineers from research engineers.',
    anchors: ['Schulman — Opinionated Guide to ML Research', 'Foerster — How to ML Paper', 'Google Tuning Playbook', 'Andrew Ng — How to Read Papers'],
  },
]

// ────────────────────────────────────────────────────────────────────────
// LIVING_LAYER — channels that stay current by being read, not by edits.
// These are not tasks; they are practices. Subscribe + integrate weekly.
// ────────────────────────────────────────────────────────────────────────

export const LIVING_LAYER: Resource[] = [
  R.interconnects,
  R.import_ai,
  R.weng_blog,
  R.raschka_blog,
  R.dwarkesh,
  R.gpu_mode,
  R.chips_cheese,
  R.hao_ai,
]
