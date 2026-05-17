/**
 * Blue — the ML Compiler conversion curriculum for Jai.
 *
 * Atlas is the multi-year arc. North is the 90-day hire sprint into LLM
 * inference. Blue is the 24-week (~6-month) conversion from "inference
 * engineer" to "ML compiler engineer" — the focused track that takes you
 * from running vLLM in production to writing your own MLIR dialect + Triton
 * kernels + PyTorch compiler passes, with a portfolio dense enough to crack
 * the funnel at NVIDIA / Modular / Anthropic / OpenAI / DeepMind compiler
 * teams. It sits AFTER North (or at least an equivalent ~12 weeks of
 * serving-infra fluency) and is the practical execution of Atlas's
 * "systems → ML compiler" Y2 fork decision.
 *
 * Mission:
 *   Inference Engineer → ML Compiler Engineer in ~24 weeks.
 *
 * Strategy:
 *   1. Close the THREE deep stacks compiler roles require — compiler theory
 *      (SSA / dataflow / IR design), GPU/kernel authoring at production
 *      depth, and ML framework internals (PyTorch dispatcher / torch.compile
 *      / Dynamo / Inductor).
 *   2. Ship THREE flagship public artifacts, each with measured numbers:
 *      C1: mini-MLIR dialect — a small custom dialect with a custom pass
 *          pipeline that lowers a real NN op down to GPU code. Roundtrip
 *          tested, public repo, design-doc writeup.
 *      C2: FlashAttention-2 reproduction in Triton — the canonical kernel
 *          interview exercise, with NCU-verified ≥85% of reference SDPA and
 *          a roofline writeup.
 *      C3: end-to-end mini-compiler — take a small NN graph (e.g., a
 *          transformer block), lower through Linalg → Affine → GPU dialect
 *          → Triton/CUDA, run on H100. The "I built a compiler" artifact.
 *   3. Land ≥2 merged OSS PRs in a real ML compiler project (one in MLIR /
 *      Triton / torch-mlir / Inductor / TVM / IREE, one anywhere).
 *   4. Build a system-design library of 4 one-pagers for compiler
 *      interviews (kernel scheduling, fusion algorithms, pass-pipeline
 *      design, autograd internals).
 *   5. Open 20+ targeted outreach threads. Convert.
 *
 * Compute posture — same as North: free first (Kaggle dual-T4, Colab),
 * paid Modal/RunPod ONLY for the four headline benchmark runs. Budget
 * cap $50-$150 over 24wk.
 *
 * Tracks (mirror Atlas):
 *   read   — papers, blogs, docs that earn the right to build
 *   build  — code that runs and produces a number on a benchmark
 *   apply  — visible artifact: PR, README, demo, application, DM
 *   prep   — interview prep, system-design study, mock loops, OSS scouting
 *
 * Half-lives:
 *   durable — SSA, dataflow, roofline, attention primitive, autograd, GPU
 *             memory hierarchy, compiler IR theory. ~10y stable.
 *   medium  — MLIR Linalg API, Triton autotune patterns, current FA
 *             variants, torch.compile internals. ~3-5y.
 *   fast    — specific SOTA papers (Hidet, Welder, Mirage), exact framework
 *             APIs (Pallas, Mojo current state), elite-lab hiring guides.
 *             ~1y. VERIFY before action.
 *
 * Brutal-honesty notes (from research + Atlas's own posture):
 *   - Compiler roles concentrate in ~10 companies (NVIDIA, Modular,
 *     OctoML/Octo, Cerebras, Groq, Tenstorrent, Apple, Tesla AI, frontier
 *     labs). Funnel is narrower than North's. Quality > breadth in the
 *     application strategy.
 *   - The three-stack bar (compiler + GPU + ML internals) is real. Most
 *     senior SWEs have 1-1.5 stacks. You're closing 1.5 stacks in 24 weeks
 *     — feasible only with daily compiler-touch.
 *   - "I wrote an MLIR dialect" is the table-stakes artifact. Without it,
 *     no compiler team takes your application seriously. C1 is non-
 *     negotiable, even if C3 slips.
 *   - OSS PRs in compilers are harder than in serving (longer reviews,
 *     deeper conventions, more pre-existing context). Start scouting
 *     issues at W2, not W18.
 *   - Math intensity higher than North. Backprop derivation, polyhedral
 *     scheduling, dataflow lattices all show up in compiler loops. The
 *     Y1Q1 math habit from Atlas is the prereq for Blue — verify before W1.
 *   - Success metric for W24 is NOT "have an offer." It is "≥25% screen-
 *     rate across ≥30 targeted applications + ≥3 referrer warm-intros +
 *     ≥1 compiler-team onsite scheduled."
 */

export type {
  Track,
  Stream,
  Cadence,
  HalfLife,
  ResourceKind,
  Resource,
  Task,
  Week,
  Phase,
} from './atlas-plan'
export {
  HALFLIFE_LABEL,
  RESOURCE_KIND_LABEL,
  STREAM_LABELS,
  TRACK_LABELS,
  BEDROCK_DOMAINS,
  LIVING_LAYER,
  periodWeeks,
} from './atlas-plan'

import type { Cadence, Phase, Resource, Task, Week } from './atlas-plan'

// ────────────────────────────────────────────────────────────────────────
// Resource library — curated, lean. Compiler-specific + reused infra refs.
// ────────────────────────────────────────────────────────────────────────

const R = {
  // ── Compiler theory + IRs ─────────────────────────────────────────────
  cs6120: {
    kind: 'course',
    title: 'Cornell CS 6120 — Advanced Compilers (Adrian Sampson)',
    url: 'https://www.cs.cornell.edu/courses/cs6120/',
    hours: '~12h (lectures 1-8)',
    why: 'SSA, dataflow, LLVM IR mental model. The single best free compilers course. Lectures 1-3 are required for Blue P1; the rest pay off in P3 (MLIR for ML).',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  llvm_kaleidoscope: {
    kind: 'docs',
    title: 'LLVM — Kaleidoscope tutorial (My First Language Frontend)',
    url: 'https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/',
    hours: '~4h',
    why: 'Build a tiny language frontend that emits LLVM IR. Type along, do not skim. The on-ramp to thinking in IR.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  mlir_toy: {
    kind: 'docs',
    title: 'MLIR Toy tutorial (chapters 1–7)',
    url: 'https://mlir.llvm.org/docs/Tutorials/Toy/',
    hours: '~6h',
    why: 'The canonical MLIR entry. Build a small ML language end-to-end through the standard pass pipeline. Type along chapter by chapter.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  mlir_dialects: {
    kind: 'docs',
    title: 'MLIR — Dialect documentation index',
    url: 'https://mlir.llvm.org/docs/Dialects/',
    why: 'Reference for every standard dialect (Linalg, Affine, GPU, Async, MemRef, SCF, etc). You will return here weekly through P3.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  mlir_linalg: {
    kind: 'docs',
    title: 'MLIR — Linalg dialect',
    url: 'https://mlir.llvm.org/docs/Dialects/Linalg/',
    hours: '~3h',
    why: 'The ML-graph dialect. Generic-op + transpose-conv + matmul abstractions. The most important dialect for ML compilers.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  mlir_affine: {
    kind: 'docs',
    title: 'MLIR — Affine dialect',
    url: 'https://mlir.llvm.org/docs/Dialects/Affine/',
    hours: '~2h',
    why: 'Polyhedral-style loop nest representation. Tiling, fusion, vectorization — the scheduling substrate.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  mlir_gpu: {
    kind: 'docs',
    title: 'MLIR — GPU dialect',
    url: 'https://mlir.llvm.org/docs/Dialects/GPU/',
    hours: '~2h',
    why: 'Hardware-agnostic GPU abstraction. The bridge between Linalg/Affine and target-specific (NVVM/ROCDL).',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  mlir_passes: {
    kind: 'docs',
    title: 'MLIR — Pass infrastructure + writing your own pass',
    url: 'https://mlir.llvm.org/docs/PassManagement/',
    hours: '~2h',
    why: 'How passes compose, how to write your own, how to schedule pipelines. The mechanic you spend every day on as a compiler engineer.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  lattner_mlir: {
    kind: 'paper',
    title: 'Lattner et al — MLIR: A Compiler Infrastructure for the End of Moore\'s Law',
    url: 'https://arxiv.org/abs/2002.11054',
    hours: '~2h',
    why: 'The origin paper. Read once for vocabulary (region, op, attribute, dialect), then refer back as needed.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  j2kun_mlir: {
    kind: 'blog',
    title: 'Jeremy Kun — MLIR for Beginners',
    url: 'https://github.com/j2kun/mlir-tutorial',
    hours: '~3h',
    why: 'Friendlier on-ramp than the official tutorials. Pair with MLIR Toy.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,

  // ── GPU + Triton (kernel author level) ────────────────────────────────
  triton_paper: {
    kind: 'paper',
    title: 'Tillet et al — Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations',
    url: 'https://www.eecs.harvard.edu/~htk/publication/2019-mapl-tillet.pdf',
    hours: '~1.5h',
    why: 'The Triton design paper. Read after you have built a few kernels — the tiling abstraction lands better with code in your hands.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  triton_docs: {
    kind: 'docs',
    title: 'OpenAI Triton — official tutorials',
    url: 'https://triton-lang.org/main/getting-started/tutorials/index.html',
    hours: '~6h',
    why: 'Vector add → fused softmax → matmul → FlashAttention. The full progression. Type along, run each, beat the autotuner.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  triton_internals: {
    kind: 'docs',
    title: 'Triton — language reference + autotuner internals',
    url: 'https://triton-lang.org/main/python-api/triton.html',
    hours: '~2h',
    why: 'autotune, heuristics, num_warps, BLOCK_M/N/K — the tuning levers. Pair with NCU.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  flashattn2: {
    kind: 'paper',
    title: 'Dao — FlashAttention-2: Faster Attention with Better Parallelism',
    url: 'https://arxiv.org/abs/2307.08691',
    hours: '~2h',
    why: '§3 is required for the W7 reproduction. The IO-aware kernel design is the canonical interview exercise.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  flashattn3: {
    kind: 'paper',
    title: 'Shah et al — FlashAttention-3: Fast and Accurate Attention on Hopper',
    url: 'https://arxiv.org/abs/2407.08608',
    hours: '~1.5h',
    why: 'Hopper-specific: warp-specialization + WGMMA + FP8. Read after FA-2 reproduction works; do NOT reproduce in Blue (deep rabbit hole).',
    tier: 2,
    halfLife: 'fast',
  } as Resource,
  hopper_whitepaper: {
    kind: 'docs',
    title: 'NVIDIA H100 / Hopper Architecture whitepaper entry',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
    hours: '~1h',
    why: 'H100 peak FLOPs, HBM3 BW, L2/SMEM sizes, wgmma shapes. Memorize the numbers page (#5, #6, #7 of BEDROCK_DOMAINS).',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  hopper_tuning_guide: {
    kind: 'docs',
    title: 'NVIDIA — Hopper Tuning Guide',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html',
    hours: '~1h',
    why: 'Tensor Core shape constraints + async pipeline (TMA, wgmma, mbarrier). When matmuls fall back to CUDA cores, this guide explains why.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  boehm_matmul: {
    kind: 'blog',
    title: 'Simon Boehm — How to Optimize a CUDA Matmul Kernel',
    url: 'https://siboehm.com/articles/22/CUDA-MMM',
    hours: '~1.5h',
    why: 'End-to-end GPU memory hierarchy in action. Touches SMEM tiling, occupancy, TC engagement. The companion to PMPP.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  horace_brrr: {
    kind: 'blog',
    title: 'Horace He — Making Deep Learning Go Brrr From First Principles',
    url: 'https://horace.io/brrr_intro.html',
    hours: '~1h',
    why: 'Compute vs memory vs overhead. The lens for every roofline analysis. Re-read at the start of every kernel project.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  gpu_mode: {
    kind: 'video',
    title: 'GPU MODE — community lectures',
    url: 'https://www.youtube.com/@GPUMODE',
    hours: 'ongoing',
    why: 'Lectures 1-2 cover memory hierarchy; later lectures cover kernel design patterns + interview prep. Subscribe and skim weekly.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  nsight_compute: {
    kind: 'docs',
    title: 'NVIDIA Nsight Compute — getting started + metrics tree',
    url: 'https://docs.nvidia.com/nsight-compute/NsightComputeCli/index.html',
    hours: '~2h',
    why: 'Without NCU, you cannot verify TC utilization or roofline regime. The profiler is the verification surface.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // ── PyTorch compiler stack ────────────────────────────────────────────
  yang_pytorch_internals: {
    kind: 'blog',
    title: 'Edward Yang — PyTorch Internals',
    url: 'http://blog.ezyang.com/2019/05/pytorch-internals/',
    hours: '~1.5h',
    why: 'Dispatcher, tensor strides, autograd graph. The mental model for everything downstream — Dynamo, Inductor, custom ops.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  torch_compile_blog: {
    kind: 'blog',
    title: 'PyTorch — torch.compile() landing page + blog posts',
    url: 'https://pytorch.org/get-started/pytorch-2-x/',
    hours: '~2h',
    why: 'The 2.x compile path overview. Pair with the deep dive blog posts on Dynamo and Inductor.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  dynamo_deepdive: {
    kind: 'blog',
    title: 'PyTorch — Dynamo deep dive (depyf + TorchDynamo internals)',
    url: 'https://pytorch.org/docs/stable/torch.compiler_dynamo_deepdive.html',
    hours: '~2h',
    why: 'How Dynamo intercepts Python bytecode + produces FX graphs. The frontend of torch.compile.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  inductor_blog: {
    kind: 'blog',
    title: 'PyTorch — Inductor (TorchInductor) deep dive',
    url: 'https://pytorch.org/docs/stable/torch.compiler.html',
    hours: '~2h',
    why: 'Inductor lowers FX graphs to Triton + C++. The backend of torch.compile. Read its decomposition + lowering passes.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  pytorch_custom_op: {
    kind: 'docs',
    title: 'PyTorch — custom operators tutorial',
    url: 'https://pytorch.org/tutorials/advanced/custom_ops_landing_page.html',
    hours: '~2h',
    why: 'Register a custom op + autograd + torch.compile integration. The bridge for a compiler engineer who wants to inject new kernels.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  pytorch_dev_podcast: {
    kind: 'video',
    title: 'PyTorch Developer Podcast (Edward Yang)',
    url: 'https://pytorch-dev-podcast.simplecast.com/',
    hours: 'ongoing',
    why: 'Short, dense episodes on dispatcher, autograd, compile internals. Listen at 1.5×; revisit specific episodes for reference.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,

  // ── Production / frontier compilers ───────────────────────────────────
  iree_docs: {
    kind: 'docs',
    title: 'IREE — official documentation',
    url: 'https://iree.dev/',
    hours: '~3h',
    why: 'End-to-end ML compiler stack on MLIR. Cleanest e2e example to study. Build it locally + run a model.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  iree_repo: {
    kind: 'repo',
    title: 'iree-org/iree',
    url: 'https://github.com/iree-org/iree',
    why: 'Read input pipelines + GPU lowerings + scheduling passes. The textbook for production MLIR-based compilers.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  tvm_paper: {
    kind: 'paper',
    title: 'Chen et al — TVM: An Automated End-to-End Optimizing Compiler for Deep Learning',
    url: 'https://arxiv.org/abs/1802.04799',
    hours: '~2h',
    why: 'The first major ML compiler paper. §3-4 (Halide-style scheduling, AutoTVM) inform every modern stack.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  tvm_repo: {
    kind: 'repo',
    title: 'apache/tvm — TVM Unity (Relax + MetaSchedule)',
    url: 'https://github.com/apache/tvm',
    why: 'The Unity rewrite (Relax IR + MetaSchedule). Read after the paper. Modern TVM is research-aligned.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  pallas_docs: {
    kind: 'docs',
    title: 'JAX Pallas — kernel DSL on JAX',
    url: 'https://docs.jax.dev/en/latest/pallas/',
    hours: '~3h',
    why: 'Triton-like kernel authoring inside JAX. Pallas is what Google\'s compiler team uses; understand it before applying to DeepMind/Google.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  mojo_docs: {
    kind: 'docs',
    title: 'Modular Mojo — language documentation',
    url: 'https://docs.modular.com/mojo/manual/',
    hours: '~2h',
    why: 'Chris Lattner\'s post-MLIR language. Built on MLIR with autotuning + simd primitives baked in. Required reading before applying to Modular.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  modular_blog: {
    kind: 'blog',
    title: 'Modular — engineering blog (MAX + Mojo deep dives)',
    url: 'https://www.modular.com/blog',
    hours: 'ongoing',
    why: 'Hardware-agnostic MAX engine internals + Mojo language posts. The window into how a modern ML compiler company thinks.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,
  hidet_paper: {
    kind: 'paper',
    title: 'Ding et al — Hidet: Task-Mapping Programming Paradigm for Deep Learning Tensor Programs',
    url: 'https://arxiv.org/abs/2210.09603',
    hours: '~1.5h',
    why: 'Newer scheduling abstraction targeting the same domain as TVM. Worth reading for "what else is out there beyond Triton/MLIR".',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  welder_paper: {
    kind: 'paper',
    title: 'Shi et al — Welder: Scheduling Deep Learning Memory Access via Tile-graph (OSDI 23)',
    url: 'https://www.usenix.org/conference/osdi23/presentation/shi',
    hours: '~1.5h',
    why: 'Tile-graph fusion algorithm. The kind of paper a compiler interviewer will ask you to summarize.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  cutlass_docs: {
    kind: 'repo',
    title: 'NVIDIA CUTLASS — CuTe + GEMM primitives',
    url: 'https://github.com/NVIDIA/cutlass',
    why: 'The reference implementation for hand-tuned GPU GEMM. Read CuTe primer + a few example kernels. Required for compiler conversations at NVIDIA.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // ── Interview prep + paper-reading ────────────────────────────────────
  keshav_paper_method: {
    kind: 'paper',
    title: 'Keshav — How to Read a Paper (3-pass method)',
    url: 'https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf',
    hours: '~30m',
    why: 'The meta-skill. Adopt the 3-pass method or you will drown in the ~20 compiler papers Blue assumes you read.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  huyen_ml_interview: {
    kind: 'book',
    title: 'Chip Huyen — Introduction to Machine Learning Interviews',
    url: 'https://huyenchip.com/ml-interviews-book/',
    hours: '~8h',
    why: 'ML systems interview structure + system-design questions. Compiler-specific ML interview material is sparse; this is the closest general-purpose resource.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  donne_martin: {
    kind: 'repo',
    title: 'donnemartin/system-design-primer',
    url: 'https://github.com/donnemartin/system-design-primer',
    why: 'Generic system-design refresher; pair with compiler-specific framings.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,

  // ── Compute (free-first, paid for headlines) ──────────────────────────
  kaggle_gpu: {
    kind: 'docs',
    title: 'Kaggle Notebooks — free dual-T4 GPU, 30h/wk',
    url: 'https://www.kaggle.com/docs/notebooks#gpu-and-tpu-quota',
    why: 'Default dev environment for Blue W0-W12 (CPU/T4 work). Triton runs cleanly on T4 for small kernels.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  modal_docs: {
    kind: 'docs',
    title: 'Modal — serverless GPU (PAID, headline runs only)',
    url: 'https://modal.com/docs',
    why: 'Spend the $50-$150 budget here on H100 for the four headline runs (W4 e2e dialect lower, W7 FA-2 bench, W12 mini-compiler, W16 torch.compile profile). Set a hard monthly cap.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  lightning_studio: {
    kind: 'docs',
    title: 'Lightning AI Studios — free credits',
    url: 'https://lightning.ai/pricing',
    why: 'Persistent studio env with limited free GPU credits. Useful for one-off A100 repros when Kaggle is not enough.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // ── Mosaic internal pointers ─────────────────────────────────────────
  mosaic_compilers: {
    kind: 'mosaic',
    title: 'Mosaic — Compilers track',
    url: '/compilers',
    why: 'Triton / MLIR / XLA pointers in Mosaic itself.',
    halfLife: 'medium',
  } as Resource,
  mosaic_ml_execution: {
    kind: 'mosaic',
    title: 'Mosaic — ML Execution track',
    url: '/ml-execution',
    why: 'KV cache, paged attention, quant — keep your notes synced.',
    halfLife: 'medium',
  } as Resource,
} as const

// ────────────────────────────────────────────────────────────────────────
// PATH — 25-week conversion (W0..W24). All weekly cadence.
// ────────────────────────────────────────────────────────────────────────

export const PATH: Phase[] = [
  // ════════════════════════════════════════════════════════════════════
  // W0 — Compiler Calibration
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b-phase-0',
    title: 'Phase 0 — Compiler Calibration',
    blurb: 'Workspace + compiler bedrock audit + target list. Five days, no more.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact:
      'blue-portfolio meta-repo + 12-company tiered target list + LLVM/MLIR/Triton/IREE installed locally + bedrock audit committed',
    context:
      'No content yet — just the rails. If setup spills past the week, rip out the friction (different linux box, different cloud, prebuilt docker) before W1. The mistake is treating W0 as "preparing to start"; the right frame is "by Friday I can write a hello-world MLIR pass on my laptop."',
    weeks: [
      {
        number: 0,
        title: 'Setup + compiler bedrock audit',
        goal:
          'LLVM + MLIR + Triton + IREE all installed and Hello-World running. blue-portfolio repo committed. 12 target compiler companies listed. Bedrock audit identifies compiler/PL gaps.',
        tasks: [
          {
            id: 'b-w0-prereq',
            track: 'prep',
            title: 'Prerequisites — Blue assumes North done (or equivalent)',
            body:
              'Can you do these cold? Blue starts where North ends:\n' +
              '  • write a Triton vector-add from scratch on Modal H100\n' +
              '  • read an NCU report — TC%, HBM throughput, kernel-time breakdown\n' +
              '  • explain prefill vs decode + KV cache mechanics\n' +
              '  • derive backprop for one MLP layer\n' +
              'If any feel fuzzy, do North W1-W4 first (or its Atlas Phase-1 equivalent). Compiler work assumes serving-infra fluency — don\'t skip the on-ramp.',
            verify: 'Self-check; if 2+ are fuzzy, complete North up to W4 before starting Blue W1.',
            hours: '30m check + variable remediation',
            resources: [R.triton_docs, R.horace_brrr, R.yang_pytorch_internals],
          },
          {
            id: 'b-w0-b1',
            track: 'build',
            title: 'Workspace — LLVM + MLIR + Triton + IREE installed',
            body:
              'Two valid setups: (a) build LLVM/MLIR from source on Linux/macOS (best for hacking); (b) use a prebuilt nightly via apt/brew. Triton via pip. IREE via prebuilt wheel or source. Verify each: write a 3-line hello-world for each toolchain.',
            verify:
              'llc --version prints LLVM; mlir-opt --version prints MLIR; python -c "import triton; print(triton.__version__)" works; iree-compile --version works.',
            hours: '4h',
            resources: [R.llvm_kaleidoscope, R.triton_docs, R.iree_docs],
          },
          {
            id: 'b-w0-b2',
            track: 'build',
            title: 'blue-portfolio meta-repo with 3 capstone skeletons',
            body:
              'Single GitHub repo (or your account). One umbrella README that links the THREE flagship capstones: c1-mlir-dialect, c2-flashattn-triton, c3-e2e-compiler. Each child gets a README stub stating goal + verify + bench plan. No code yet.',
            verify:
              'Four public repos exist (umbrella + 3 capstones); each child README has a Verify + Bench section.',
            hours: '1.5h',
          },
          {
            id: 'b-w0-r1',
            track: 'read',
            title: 'Lattner MLIR origin paper — vocabulary pass',
            body:
              'Read once at normal speed. Goal is vocabulary: region, op, attribute, dialect, conversion, rewrite pattern. You will return to this paper every phase.',
            verify: 'One-paragraph summary in notes; six-term glossary written from memory.',
            hours: '2h',
            resources: [R.lattner_mlir],
          },
          {
            id: 'b-w0-a1',
            track: 'apply',
            title: 'LinkedIn headline + about — "ML Compiler Engineer"',
            body:
              'No announcement. Just hygiene: headline says "ML Compiler / Inference Systems Engineer". About paragraph highlights kernel + serving experience. Recruiter-search keywords: MLIR, Triton, CUDA, LLVM, PyTorch internals, ML compiler.',
            verify: 'Profile live; the five keywords above appear naturally.',
            hours: '45m',
          },
          {
            id: 'b-w0-a2',
            track: 'apply',
            title: 'Target list — 12 ML compiler companies, tiered',
            body:
              'Four tiers, narrower than North\'s funnel because the ML compiler market is smaller:\n' +
              '  Tier A (India / India-remote-friendly): NVIDIA India (compiler team), Modular (remote), Hugging Face Optimum, OctoML/Octo.\n' +
              '  Tier B (global remote-first or visa-friendly): Anthropic (Bengaluru office for some roles), OpenAI, DeepMind, Cerebras, Groq.\n' +
              '  Tier C (US-onsite, longer lead): Tenstorrent, SambaNova, Apple AI, Tesla AI, Meta PyTorch Compiler.\n' +
              '  Tier D (aspirational stretches): keep ≤2 names.\n' +
              'For each: role title, current openings URL, named referrer candidate (LinkedIn URL). OSS: 10 "good first issue" tickets across llvm-project (MLIR), triton-lang/triton, pytorch/pytorch (compile), iree-org/iree, apache/tvm.',
            verify: 'docs/targets.md committed with 12 companies tiered A/B/C/D, named referrer per row, OSS shortlist of 10 issues.',
            hours: '3h',
          },
          {
            id: 'b-w0-a3',
            track: 'apply',
            title: 'Build-in-public continuation — weekly post slot',
            body:
              'If you ran the North build-in-public post, continue the cadence. If not, start now: pinned tweet "Spending the next 24 weeks rebuilding the ML compiler stack from MLIR up. Public log here." One Friday post per week.',
            verify: 'Pinned post live; Friday weekly-post slot on calendar for W1–W24.',
            hours: '45m',
          },
          {
            id: 'b-w0-p1',
            track: 'prep',
            title: 'Calendar block — 18h/wk for 24 weeks',
            body:
              'Slightly less than North\'s 20h because Blue assumes you\'re also in an inference role. Recurring blocks, immovable. If day-job leaks past these for two weeks running, the sprint is dead — say it out loud now.',
            verify: 'Recurring 18h/wk on calendar through W24.',
            hours: '30m',
          },
          {
            id: 'b-w0-p2',
            track: 'prep',
            title: 'System-design notebook — 4 empty compiler pages',
            body:
              'Pre-create 4 empty system-design pages: (1) design a Triton-like kernel DSL, (2) design a pass pipeline for a transformer block, (3) explain autograd internals to a compiler interviewer, (4) design a fusion algorithm. Fill across P1-P5.',
            verify: 'Four empty pages exist with the same template (problem / constraints / arch / tradeoffs / numbers).',
            hours: '30m',
          },
        ],
        reading: [R.lattner_mlir, R.cs6120, R.mlir_toy, R.iree_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // P1 — Compiler Bedrock (W1-W4)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b-phase-1',
    title: 'Phase 1 — Compiler Bedrock',
    blurb: 'SSA, dataflow, LLVM IR, MLIR. Build your first dialect + pass pipeline.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'c1-mlir-dialect — custom MLIR dialect with 3 ops + a lowering pass + roundtrip tests',
    context:
      'The single most important phase of Blue for "I am a compiler engineer" interview signal. Without a custom MLIR dialect in your repo, no compiler team takes your application seriously. C1 is non-negotiable, even if everything downstream slips.',
    weeks: [
      {
        number: 1,
        title: 'SSA + dataflow + LLVM IR',
        goal: 'CS 6120 lectures 1-3 watched, Kaleidoscope ch.1-3 typed-along. You can read LLVM IR and explain phi nodes.',
        tasks: [
          {
            id: 'b-w1-r1',
            track: 'read',
            title: 'CS 6120 lectures 1–3 — SSA, dataflow analysis, IR basics',
            body:
              'Adrian Sampson\'s course. Lectures 1-3 cover the conceptual core. Watch with notes open; rewatch at 1× for the dataflow lattice slides.',
            verify: 'Notes: SSA invariant in one sentence; phi function example; reaching-definitions vs available-expressions in your own words.',
            hours: '4h',
            resources: [R.cs6120],
          },
          {
            id: 'b-w1-r2',
            track: 'read',
            title: 'LLVM Kaleidoscope ch.1-3 — lexer, parser, IR emission',
            body:
              'Type the code, do not paste. By end of chapter 3 you should have a tiny language that emits valid LLVM IR for arithmetic expressions.',
            verify: 'kaleidoscope binary builds; "def foo(x) x*x+1" prints valid LLVM IR.',
            hours: '4h',
            resources: [R.llvm_kaleidoscope],
          },
          {
            id: 'b-w1-b1',
            track: 'build',
            title: 'Implement a trivial LLVM optimization pass',
            body:
              'Dead code elimination on a small IR snippet, OR constant folding. Use the legacy or new pass manager. Test on 3 hand-written .ll files.',
            verify: 'opt -load mypass.so -mypass < input.ll > output.ll runs; output strictly smaller for at least one input.',
            hours: '4h',
            resources: [R.llvm_kaleidoscope, R.cs6120],
          },
          {
            id: 'b-w1-a1',
            track: 'apply',
            title: 'Weekly post — "Reading LLVM IR like a compiler"',
            body:
              'Friday post. One concrete example: convert a 3-line C function to LLVM IR by hand, then verify against -emit-llvm. Show your hand-derivation vs the compiler\'s output and explain the difference. 200 words max.',
            verify: 'Twitter/X thread + LinkedIn post live; one IR snippet inline.',
            hours: '1h',
          },
        ],
        reading: [R.cs6120, R.llvm_kaleidoscope, R.lattner_mlir],
      },
      {
        number: 2,
        title: 'MLIR Toy + dialect mental model',
        goal: 'MLIR Toy chapters 1-7 complete. You can explain region/op/attribute/dialect from memory.',
        tasks: [
          {
            id: 'b-w2-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W2',
            body:
              'Can you do these cold?\n' +
              '  • SSA in one sentence; phi function example\n' +
              '  • Read 5 lines of LLVM IR and explain each\n' +
              '  • The Lattner MLIR paper vocabulary (region/op/attribute/dialect)\n' +
              'If any are fuzzy, re-skim CS 6120 lecture 1 OR re-read Lattner §2 before r1.',
            verify: 'Self-check; remediation started if any rating <3.',
            hours: '15m check',
            resources: [R.cs6120, R.lattner_mlir],
          },
          {
            id: 'b-w2-r1',
            track: 'read',
            title: 'MLIR Toy chapters 1-7 — type along, do not skim',
            body:
              'Chapter 1 (language), 2 (emitting MLIR), 3 (high-level optimization), 4 (interfaces + generic ops), 5 (lowering toward LLVM), 6 (lowering to LLVM IR + JIT), 7 (adding a composite type).',
            verify: 'All 7 chapter binaries build and run end-to-end; you can explain the lowering progression in 4 sentences.',
            hours: '6h',
            resources: [R.mlir_toy],
          },
          {
            id: 'b-w2-r2',
            track: 'read',
            title: 'j2kun MLIR for Beginners — first 3 posts',
            body:
              'Friendlier on-ramp than the official tutorials. Skim if MLIR Toy already clicked; deep-read if it didn\'t.',
            verify: 'Notes: one paragraph contrasting MLIR Toy\'s style vs j2kun\'s.',
            hours: '2h',
            resources: [R.j2kun_mlir],
          },
          {
            id: 'b-w2-b1',
            track: 'build',
            title: 'Roundtrip test — define a tiny custom op in MLIR Toy',
            body:
              'Modify Toy ch.7\'s composite type code to add a new "fma" operation (fused multiply-add). Add a roundtrip test (parse → print → parse must yield identical IR).',
            verify: 'mlir-opt roundtrip on your fma op passes; one filecheck test green.',
            hours: '3h',
            resources: [R.mlir_toy],
          },
          {
            id: 'b-w2-a1',
            track: 'apply',
            title: 'Weekly post — "MLIR Toy in a weekend"',
            body:
              'Friday post. Show the diff for your fma op. 150 words explaining what an MLIR dialect is in plain language + the roundtrip pattern.',
            verify: 'Post live; diff or screenshot included.',
            hours: '1h',
          },
        ],
        reading: [R.mlir_toy, R.j2kun_mlir, R.mlir_dialects],
      },
      {
        number: 3,
        title: 'Custom MLIR dialect — c1-mlir-dialect kicks off',
        goal: 'Your own dialect with 3 ops defined. Tablegen working. Roundtrip tests green.',
        tasks: [
          {
            id: 'b-w3-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W3',
            body:
              'Can you do these cold?\n' +
              '  • Define a Toy op via TableGen — what fields are required?\n' +
              '  • What is a roundtrip test, why does it matter?\n' +
              '  • Read an MLIR op and identify its operands, results, attributes.\n' +
              'If fuzzy, re-skim Toy ch.2 + ch.7 before r1.',
            verify: 'Self-check; remediation started if rating <3.',
            hours: '15m check',
            resources: [R.mlir_toy],
          },
          {
            id: 'b-w3-r1',
            track: 'read',
            title: 'MLIR Dialects index + the Linalg + GPU dialect docs (skim)',
            body:
              'Skim only — you\'ll deep-read Linalg in W9. Goal here: understand the SHAPE of a real production dialect (op count, attribute design, type interactions). Your dialect will be tiny by comparison.',
            verify: 'Notes: Linalg\'s generic op signature in your own words; GPU dialect\'s launchOp signature.',
            hours: '2h',
            resources: [R.mlir_dialects, R.mlir_linalg, R.mlir_gpu],
          },
          {
            id: 'b-w3-b1',
            track: 'build',
            title: 'c1-mlir-dialect — scaffold + 3 ops',
            body:
              'Create your dialect under c1-mlir-dialect/. Pick a domain that makes sense for ML (e.g., "tinyml" with add / mul / relu). Define 3 ops via TableGen with proper operands, results, type constraints. Build out-of-tree against installed MLIR.',
            verify: 'c1-mlir-dialect builds; mlir-opt loads your dialect; you can write a .mlir file using all 3 ops.',
            hours: '5h',
            resources: [R.mlir_passes, R.mlir_dialects],
          },
          {
            id: 'b-w3-b2',
            track: 'build',
            title: 'Roundtrip + filecheck tests',
            body:
              'For each op: a roundtrip test (parse-print idempotent) and at least one filecheck verifying the printed form. Wire into `lit`.',
            verify: 'lit test suite green for all 3 ops; CI yaml committed.',
            hours: '2h',
          },
          {
            id: 'b-w3-a1',
            track: 'apply',
            title: 'Weekly post — first dialect',
            body:
              '200 words. The IR snippet for your dialect. One sentence on why TableGen exists. Repo link.',
            verify: 'Post live with IR snippet image or code block.',
            hours: '1h',
          },
        ],
        reading: [R.mlir_dialects, R.mlir_passes, R.lattner_mlir],
      },
      {
        number: 4,
        title: 'Pass pipeline composition — c1 lowering',
        goal: 'A custom pass that rewrites your dialect (e.g., fuses add+mul → fma). Pass pipeline composed.',
        tasks: [
          {
            id: 'b-w4-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W4',
            body:
              'Can you do these cold?\n' +
              '  • What is a Conversion vs a Rewrite pattern in MLIR?\n' +
              '  • What does the pass manager do that you cannot do with a script?\n' +
              '  • Apply 2 passes in sequence and inspect intermediate IR.\n' +
              'If fuzzy, read MLIR Pass Management docs before r1.',
            verify: 'Self-check; PassManagement skimmed if rating <3.',
            hours: '15m check',
            resources: [R.mlir_passes],
          },
          {
            id: 'b-w4-r1',
            track: 'read',
            title: 'MLIR Pass infrastructure + canonicalization patterns',
            body:
              'Read PassManagement + Canonicalization docs. Look at how Toy\'s canonicalizer works as the reference.',
            verify: 'Notes: pass-manager nesting; OpRewritePattern vs ConversionPattern in one paragraph.',
            hours: '2h',
            resources: [R.mlir_passes, R.mlir_toy],
          },
          {
            id: 'b-w4-b1',
            track: 'build',
            title: 'c1 — custom rewrite pass (add+mul → fma)',
            body:
              'Write a rewrite pattern that finds add(mul(a, b), c) and rewrites to fma(a, b, c). Wire into a Pass. Add a filecheck test that verifies the rewrite.',
            verify: 'c1-mlir-dialect-opt --fma-fuse rewrites correctly; filecheck green.',
            hours: '5h',
            resources: [R.mlir_passes],
          },
          {
            id: 'b-w4-b2',
            track: 'build',
            title: 'c1 — pass pipeline + DESIGN.md',
            body:
              'Compose your pass + the standard MLIR canonicalizer + the conversion-to-LLVM dialect (existing). Write c1-mlir-dialect/DESIGN.md (≤ 1500 words): what the dialect represents, what each pass does, what a real lowering pipeline looks like.',
            verify: 'Pipeline executes end-to-end on a sample input; DESIGN.md committed.',
            hours: '3h',
          },
          {
            id: 'b-w4-a1',
            track: 'apply',
            title: 'Weekly post — c1 v1 + headline number',
            body:
              'Friday post. Show before/after IR for the fma rewrite. One screenshot of the dialect doing its thing. Link to c1 repo. This is the post most likely to surface in compiler-eng circles.',
            verify: 'Post live; repo public; DESIGN.md linked.',
            hours: '1.5h',
          },
        ],
        reading: [R.mlir_passes, R.mlir_dialects, R.mlir_linalg],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // P2 — Triton Mastery (W5-W8)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b-phase-2',
    title: 'Phase 2 — Triton Mastery',
    blurb: 'Kernel author level. Autotune, FlashAttention-2 reproduction, NCU profiling.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'c2-flashattn-triton — FlashAttention-2 forward in Triton, ≥85% of torch SDPA reference, with NCU report',
    context:
      'C2 is the canonical kernel exercise — every compiler interviewer asks about it. Reproducing FA-2 in Triton signals you can do kernel-author work end-to-end. It also gives you a NUMBER (TFLOPS/s, % of peak, AI) to anchor every interview conversation.',
    weeks: [
      {
        number: 5,
        title: 'Triton tutorials end-to-end',
        goal: 'All 5 Triton tutorials run on Modal H100. You can explain the tile abstraction.',
        tasks: [
          {
            id: 'b-w5-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W5',
            body:
              'Can you do these cold?\n' +
              '  • H100 bandwidth pyramid (HBM3, L2, SMEM, regs)\n' +
              '  • Roofline regime prediction for a (shape, dtype, hardware) triple\n' +
              '  • Triton vector-add from W0 still runs cleanly\n' +
              'If any are fuzzy, re-read Horace He brrr + the Hopper whitepaper numbers page.',
            verify: 'Self-check; remediation started if any rating <3.',
            hours: '15m check',
            resources: [R.horace_brrr, R.hopper_whitepaper],
          },
          {
            id: 'b-w5-r1',
            track: 'read',
            title: 'Triton tutorials 1–5 — type along',
            body:
              'Vector add → fused softmax → matmul → dropout → low-memory dropout. Type, run, beat the autotuner on at least one tutorial.',
            verify: 'All 5 binaries run; matmul achieves ≥80% of cuBLAS on (4096, 4096, 4096) fp16.',
            hours: '6h',
            resources: [R.triton_docs],
          },
          {
            id: 'b-w5-r2',
            track: 'read',
            title: 'Triton paper — §3 design + §4 evaluation',
            body:
              'Now that you\'ve typed tutorials, the paper\'s tile abstraction lands. §3 is the design. §4 is the eval (compare to cuDNN).',
            verify: 'Notes: tile abstraction in one paragraph; one example where it differs from CUDA programming.',
            hours: '1.5h',
            resources: [R.triton_paper],
          },
          {
            id: 'b-w5-b1',
            track: 'build',
            title: 'Fused dropout kernel — your own',
            body:
              'Beyond the tutorial: write fused dropout(x) = mask ? x / (1-p) : 0 with a single kernel launch + RNG state passed in. Verify against torch.nn.functional.dropout.',
            verify: 'pytest: matches torch dropout statistics within 1% over 10k elements; runtime ≤ 1.5× torch.',
            hours: '3h',
          },
        ],
        reading: [R.triton_docs, R.triton_paper, R.gpu_mode],
      },
      {
        number: 6,
        title: 'Autotune + occupancy + memory swizzle',
        goal: 'Triton matmul tuned to ≥90% cuBLAS via autotune + manual occupancy analysis.',
        tasks: [
          {
            id: 'b-w6-r1',
            track: 'read',
            title: 'Triton autotune + GPU MODE kernel lectures (3-5)',
            body:
              'autotune decorator, num_warps, num_stages, BLOCK_M/N/K choices. Pair with GPU MODE lectures 3-5 on occupancy + memory swizzling.',
            verify: 'Notes: occupancy formula; when increasing num_warps hurts; memory swizzle in one paragraph.',
            hours: '3h',
            resources: [R.triton_internals, R.gpu_mode],
          },
          {
            id: 'b-w6-b1',
            track: 'build',
            title: 'Tune Triton matmul to ≥90% cuBLAS',
            body:
              'Start from the tutorial matmul. Iterate on BLOCK sizes, num_warps, num_stages, prefetching. Track each config\'s TFLOPS/s in a spreadsheet. The autotuner is your starting point, not your endpoint.',
            verify: '≥90% of cuBLAS on (4096, 4096, 4096) fp16 on H100. configs.json with the winning settings.',
            hours: '5h',
            resources: [R.triton_internals, R.boehm_matmul],
          },
          {
            id: 'b-w6-b2',
            track: 'build',
            title: 'NCU report — explain the gap to 100% cuBLAS',
            body:
              'Run ncu --set full on your tuned matmul. Find the limiter. Write a 200-word explanation: where is the remaining time spent? Pipeline stalls? Memory? Math underutilization?',
            verify: 'docs/w6-ncu.md with the report screenshot + a one-paragraph diagnosis.',
            hours: '2h',
            resources: [R.nsight_compute],
          },
          {
            id: 'b-w6-a1',
            track: 'apply',
            title: 'Weekly post — autotune walkthrough',
            body:
              '300 words. Show the configs.json + the curve of TFLOPS/s vs BLOCK_M. One screenshot of the NCU diff.',
            verify: 'Post live with the curve image.',
            hours: '1.5h',
          },
        ],
        reading: [R.triton_internals, R.boehm_matmul, R.gpu_mode],
      },
      {
        number: 7,
        title: 'c2 — FlashAttention-2 in Triton',
        goal: 'FA-2 forward pass working in Triton, ≥85% of torch SDPA.',
        tasks: [
          {
            id: 'b-w7-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W7',
            body:
              'Can you do these cold?\n' +
              '  • Online softmax — one-pass max + sum trick\n' +
              '  • Q·Kᵀ tiling — why tile both rows and columns\n' +
              '  • Backward-pass recomputation logic (you will not implement backward in Blue, but you should know the trick)\n' +
              'If fuzzy, re-read FA-2 paper §3 before r1.',
            verify: 'Self-check; FA-2 §3 re-read if rating <3.',
            hours: '15m check',
            resources: [R.flashattn2],
          },
          {
            id: 'b-w7-r1',
            track: 'read',
            title: 'FlashAttention-2 paper §3 — implementation map',
            body:
              'Map the paper\'s algorithm to Triton blocks. Sketch the kernel\'s block structure on paper before writing code.',
            verify: 'Hand-drawn block diagram in notes; tile sizes chosen and justified.',
            hours: '2h',
            resources: [R.flashattn2],
          },
          {
            id: 'b-w7-r2',
            track: 'read',
            title: 'Reference Triton implementations — sgl-project / triton-lang examples',
            body:
              'Read at least two reference impls. Goal: see the conventions (tile sizes, BLOCK_DMODEL, mask handling). Do NOT copy — type your own.',
            verify: 'Notes: two implementations\' tile-size choices contrasted in one paragraph.',
            hours: '2h',
          },
          {
            id: 'b-w7-b1',
            track: 'build',
            title: 'c2-flashattn-triton/forward.py — your own implementation',
            body:
              'FA-2 forward pass, causal + non-causal, fp16, head_dim in {64, 128}. No backward. Match torch SDPA output to 1e-3 atol on 5 test shapes.',
            verify: 'pytest: numerically matches torch SDPA across 5 shapes; runtime ≥ 85% of torch SDPA on (4096, 32, 128) on H100.',
            hours: '8h',
            resources: [R.triton_docs, R.flashattn2],
          },
          {
            id: 'b-w7-a1',
            track: 'apply',
            title: 'BENCHMARKS.md — the headline numbers',
            body:
              'Hardware row, dtype row, head_dim row. TTFT, throughput, peak HBM for batch=1/4/16 at seq_len=2048. Reproducible from a single command.',
            verify: 'BENCHMARKS.md committed; run.sh reproduces in <10 min on Modal H100.',
            hours: '2h',
          },
        ],
        reading: [R.flashattn2, R.flashattn3, R.triton_docs],
      },
      {
        number: 8,
        title: 'NCU-driven optimization + c2 writeup',
        goal: 'NCU profile of your FA-2; identified the bottleneck; writeup published.',
        tasks: [
          {
            id: 'b-w8-b1',
            track: 'build',
            title: 'Headline NCU run — paid Modal H100, 1 hour',
            body:
              'Second paid Modal H100 hour of Blue. ncu --set full on your FA-2 at (4096, 32, 128). Capture kernel-time breakdown, TC%, HBM throughput. Diff against torch SDPA reference where possible.',
            verify: 'c2-flashattn-triton/ncu-report.md with screenshots + three numbers + a paragraph diagnosis.',
            hours: '2h',
            resources: [R.nsight_compute, R.modal_docs],
          },
          {
            id: 'b-w8-b2',
            track: 'build',
            title: 'Tune to close the gap by ≥10pp',
            body:
              'Based on the NCU diagnosis: tune BLOCK sizes, swizzle, prefetch, or rearrange the inner loop. Goal: move from 85% of torch SDPA to ≥95%.',
            verify: 'New BENCHMARKS row showing the improvement; before/after NCU side-by-side.',
            hours: '4h',
          },
          {
            id: 'b-w8-a1',
            track: 'apply',
            title: 'Writeup — "Reproducing FA-2 in 600 lines of Triton"',
            body:
              'Long-form blog post (~1500 words). Hand-drawn block diagram, NCU before/after, the one optimization that mattered. This is the post that gets re-shared in compiler-eng circles and surfaces you to recruiters.',
            verify: 'Blog post published (personal site or dev.to or hashnode); Twitter/X thread with the headline chart; LinkedIn cross-post.',
            hours: '4h',
          },
          {
            id: 'b-w8-a2',
            track: 'apply',
            title: 'Outreach round 1 — 5 referrer DMs',
            body:
              'Pick 5 people from your target-company list who work on compiler/kernel teams. Short DM: "I just reproduced FA-2 in Triton at 95% of torch SDPA, writeup here. Can I ask one specific question about your team\'s autotune approach?" The number is what earns the reply.',
            verify: '5 DMs sent; replies tracked in docs/outreach.md.',
            hours: '2h',
          },
          {
            id: 'b-w8-p1',
            track: 'prep',
            title: 'System-design page 1 — "Design a kernel DSL"',
            body:
              'Fill the empty W0 page 1. Constraints (target hardware coverage, autotuning, fallback). Components. Tradeoffs. Practice presenting in 25 min.',
            verify: 'Page filled; 25-min self-presentation rehearsed.',
            hours: '2.5h',
            resources: [R.triton_paper, R.cs6120],
          },
        ],
        reading: [R.flashattn2, R.flashattn3, R.nsight_compute, R.cutlass_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // P3 — MLIR for ML (W9-W12)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b-phase-3',
    title: 'Phase 3 — MLIR for ML',
    blurb: 'Linalg + Affine + GPU dialects. Build an end-to-end mini-compiler.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-compilers)',
    artifact: 'c3-e2e-compiler — lowers a small NN graph through Linalg → Affine → GPU → CUDA/Triton on H100',
    context:
      'This is where the three-stack convergence happens. C1 gave you dialect mechanics. C2 gave you kernel authoring depth. C3 wires them together into a real (tiny) ML compiler. By the end of P3 you can answer "have you built a compiler" with a yes and a repo.',
    weeks: [
      {
        number: 9,
        title: 'Linalg dialect deep dive',
        goal: 'You can write Linalg generic ops by hand and lower a small graph to Linalg form.',
        tasks: [
          {
            id: 'b-w9-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W9',
            body:
              'Can you do these cold?\n' +
              '  • Your c1 dialect — write a 5-line .mlir file using it\n' +
              '  • The conversion-to-LLVM dialect lowering pattern\n' +
              '  • A Linalg op signature from the dialect docs\n' +
              'If fuzzy, re-skim c1 DESIGN.md + Linalg dialect docs intro.',
            verify: 'Self-check; remediation started if rating <3.',
            hours: '15m check',
            resources: [R.mlir_linalg],
          },
          {
            id: 'b-w9-r1',
            track: 'read',
            title: 'Linalg dialect — generic op, named ops, structured payloads',
            body:
              'Read the full Linalg docs. The generic op is the foundation; named ops (matmul, conv, etc.) lower to generic. Understand the iterator type vocabulary (parallel, reduction, window).',
            verify: 'Notes: generic op signature decomposed; one named op rewritten to generic by hand.',
            hours: '3h',
            resources: [R.mlir_linalg],
          },
          {
            id: 'b-w9-b1',
            track: 'build',
            title: 'c3-e2e-compiler/ — scaffold + Linalg input',
            body:
              'Start c3 repo. Define the input format: a small Python-ish DSL or pytorch fx-graph that represents a (matmul → relu → matmul) sequence. Lower it to Linalg generic form. Print the IR.',
            verify: 'c3 binary takes the input and prints Linalg IR; one filecheck test green.',
            hours: '5h',
            resources: [R.mlir_linalg, R.mlir_passes],
          },
          {
            id: 'b-w9-a1',
            track: 'apply',
            title: 'Weekly post — Linalg in one diagram',
            body:
              'Friday post. The Linalg generic op visualized — iterator types as colored axes, payload as the inner-loop body. 200 words.',
            verify: 'Post live with the diagram.',
            hours: '1h',
          },
        ],
        reading: [R.mlir_linalg, R.mlir_passes],
      },
      {
        number: 10,
        title: 'Affine dialect + scheduling (tiling, fusion)',
        goal: 'A Linalg→Affine lowering that tiles your matmul; benched against the untiled baseline.',
        tasks: [
          {
            id: 'b-w10-r1',
            track: 'read',
            title: 'Affine dialect — loops, maps, tiling primitives',
            body:
              'Affine is MLIR\'s polyhedral substrate. Read the dialect docs + at least one example pass that does tiling.',
            verify: 'Notes: affine.for vs scf.for; affine map syntax with one example.',
            hours: '3h',
            resources: [R.mlir_affine],
          },
          {
            id: 'b-w10-r2',
            track: 'read',
            title: 'Tile-graph scheduling — Welder paper §1-3 (skim)',
            body:
              'Modern scheduling research. Skim §1-3 for the vocabulary; deep-dive only if a compiler interviewer asks about it.',
            verify: 'Notes: tile-graph in one sentence; Welder vs Halide-style scheduling.',
            hours: '1.5h',
            resources: [R.welder_paper],
          },
          {
            id: 'b-w10-b1',
            track: 'build',
            title: 'c3 — Linalg → Affine pass that tiles the matmul',
            body:
              'Write a pass that lowers your matmul Linalg op to Affine with a 32×32 tile. Use Linalg\'s built-in tiling utilities. Verify with filecheck.',
            verify: 'Pass produces a tiled Affine loop nest; filecheck verifies the tile size; runtime within 30% of untiled (you are not optimizing yet).',
            hours: '4h',
            resources: [R.mlir_affine, R.mlir_passes],
          },
          {
            id: 'b-w10-a1',
            track: 'apply',
            title: 'Weekly post — tile-graph in one screenshot',
            body:
              '200 words. Before/after IR for the tiling pass. One sentence on why tile size matters.',
            verify: 'Post live with the IR diff.',
            hours: '1h',
          },
        ],
        reading: [R.mlir_affine, R.welder_paper, R.hidet_paper],
      },
      {
        number: 11,
        title: 'GPU + Async dialects',
        goal: 'A Linalg→Affine→GPU lowering chain. Your matmul runs on H100 via the GPU dialect.',
        tasks: [
          {
            id: 'b-w11-r1',
            track: 'read',
            title: 'MLIR GPU dialect + NVVM lowering',
            body:
              'Read GPU dialect docs. Understand gpu.launch, gpu.func, the memory space attributes. Skim the NVVM target.',
            verify: 'Notes: gpu.launch signature; memory space taxonomy (global / workgroup / private).',
            hours: '3h',
            resources: [R.mlir_gpu],
          },
          {
            id: 'b-w11-r2',
            track: 'read',
            title: 'IREE input pipeline — read the source',
            body:
              'IREE\'s input dialect → Linalg → Stream → HAL → target is the cleanest production example. Read the IR sketches in their docs + a few passes.',
            verify: 'Sketch of IREE\'s pipeline in one page of notes.',
            hours: '3h',
            resources: [R.iree_docs, R.iree_repo],
          },
          {
            id: 'b-w11-b1',
            track: 'build',
            title: 'c3 — Affine → GPU dialect lowering',
            body:
              'Write a pass that maps your tiled Affine matmul to gpu.launch with workgroup/thread structure. Use mlir-cuda-runner or invoke nvcc on the LLVM IR.',
            verify: 'Generated GPU kernel runs on H100; result matches CPU baseline to 1e-3 atol.',
            hours: '5h',
            resources: [R.mlir_gpu, R.modal_docs],
          },
        ],
        reading: [R.mlir_gpu, R.iree_docs, R.iree_repo],
      },
      {
        number: 12,
        title: 'c3 e2e + headline benchmark',
        goal: 'Full pipeline: NN graph → Linalg → Affine → GPU → H100. Benched + written up.',
        tasks: [
          {
            id: 'b-w12-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W12',
            body:
              'Can you do these cold?\n' +
              '  • c3 pipeline stages (Linalg → Affine → GPU → LLVM) — sketch from memory\n' +
              '  • Why tiling matters for cache behavior\n' +
              'If fuzzy, re-skim your c3 DESIGN draft + W11 NCU.',
            verify: 'Self-check; remediation started if rating <3.',
            hours: '15m check',
          },
          {
            id: 'b-w12-b1',
            track: 'build',
            title: 'c3 — end-to-end on (matmul → relu → matmul)',
            body:
              'Wire all your passes into a single pipeline. Take the input DSL, run it end-to-end, get GPU output. Verify against a torch reference.',
            verify: 'c3 ./run.sh input.dsl produces correct output on H100; bench script committed.',
            hours: '6h',
          },
          {
            id: 'b-w12-b2',
            track: 'build',
            title: 'Headline benchmark — c3 vs torch.compile',
            body:
              'Third paid Modal H100 hour. Bench your c3 pipeline against torch.compile on the same graph. You will lose; that\'s fine. The interesting number is HOW MUCH you lose by, and why.',
            verify: 'BENCHMARKS.md with c3 vs torch.compile TFLOPS + a paragraph on where the gap is (almost certainly: torch.compile uses a tuned Triton kernel, you use a naive Affine lowering).',
            hours: '3h',
            resources: [R.modal_docs, R.nsight_compute],
          },
          {
            id: 'b-w12-a1',
            track: 'apply',
            title: 'c3 writeup — "I built a tiny ML compiler in 8 weeks"',
            body:
              'Long-form post. Pipeline diagram. IR at each stage. The honest gap to torch.compile. This is the C3 artifact — the "I built a compiler" credential.',
            verify: 'Blog post live; Twitter/X thread with the pipeline diagram; LinkedIn cross-post.',
            hours: '4h',
          },
          {
            id: 'b-w12-p1',
            track: 'prep',
            title: 'System-design page 2 — "Design a pass pipeline for a transformer block"',
            body:
              'Fill the empty W0 page 2. Constraints (target latency, batch size, dtype). Pipeline stages. Tradeoffs.',
            verify: 'Page filled; 25-min self-presentation rehearsed.',
            hours: '2.5h',
          },
        ],
        reading: [R.iree_repo, R.tvm_repo, R.mlir_passes],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // P4 — PyTorch Compiler Stack (W13-W16)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b-phase-4',
    title: 'Phase 4 — PyTorch Compiler Stack',
    blurb: 'torch.compile internals: Dynamo (frontend) + Inductor (backend). Custom ops with autograd.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-applied)',
    artifact: 'A custom Inductor decomposition + a custom op registered with autograd + torch.compile, benchmarked on a real workload',
    context:
      'Most ML compiler roles at scale touch PyTorch (Meta\'s own team, NVIDIA, frontier labs). torch.compile is the compiler that ships to millions; understanding it is table-stakes. P4 reuses your kernel + dialect skills but applied to a production stack.',
    weeks: [
      {
        number: 13,
        title: 'torch.compile + Dynamo internals',
        goal: 'You can trace a model with Dynamo, inspect the FX graph, and explain a graph break.',
        tasks: [
          {
            id: 'b-w13-r1',
            track: 'read',
            title: 'Edward Yang — PyTorch Internals (re-read)',
            body:
              'Dispatcher, tensor strides, autograd graph. This is the pre-2.0 mental model that everything compile-related sits on top of.',
            verify: 'Notes: dispatch key in one paragraph; difference between TensorImpl and Storage.',
            hours: '2h',
            resources: [R.yang_pytorch_internals],
          },
          {
            id: 'b-w13-r2',
            track: 'read',
            title: 'TorchDynamo deep dive (depyf + official docs)',
            body:
              'How Dynamo intercepts Python bytecode and produces an FX graph. Graph breaks. Guards.',
            verify: 'Notes: one example of a graph break + why it happens.',
            hours: '3h',
            resources: [R.dynamo_deepdive, R.torch_compile_blog],
          },
          {
            id: 'b-w13-b1',
            track: 'build',
            title: 'Trace a small model + inspect graph + induced break',
            body:
              'Pick a small model with one intentional Python-isnt-traceable construct (e.g., a print in the forward). Use torch._dynamo.export to inspect the graph. Identify the break, fix it, re-trace.',
            verify: 'Side-by-side: graph with break vs graph without; written explanation.',
            hours: '3h',
            resources: [R.dynamo_deepdive],
          },
          {
            id: 'b-w13-a1',
            track: 'apply',
            title: 'Weekly post — "Graph breaks 101"',
            body:
              '300 words. One graph break example with the fix. Useful to recruiters because every PyTorch user hits these.',
            verify: 'Post live with the FX graph image.',
            hours: '1.5h',
          },
        ],
        reading: [R.yang_pytorch_internals, R.dynamo_deepdive, R.pytorch_dev_podcast],
      },
      {
        number: 14,
        title: 'TorchInductor — decomposition + lowering',
        goal: 'You can write a custom decomposition rule for Inductor.',
        tasks: [
          {
            id: 'b-w14-r1',
            track: 'read',
            title: 'TorchInductor architecture + lowering passes',
            body:
              'How Inductor lowers an FX graph to Triton + C++. Decompositions, lowering, scheduling.',
            verify: 'Notes: decomposition vs lowering; the role of TritonTemplate.',
            hours: '3h',
            resources: [R.inductor_blog],
          },
          {
            id: 'b-w14-r2',
            track: 'read',
            title: 'Read 3 Inductor PRs in pytorch/pytorch',
            body:
              'Filter pytorch/pytorch PRs by `module: inductor` label. Read 3 recently-merged PRs in detail. Goal: pattern-match what a small Inductor contribution looks like.',
            verify: 'Notes: one paragraph per PR — what changed + why.',
            hours: '2h',
          },
          {
            id: 'b-w14-b1',
            track: 'build',
            title: 'Custom Inductor decomposition for a small op',
            body:
              'Pick a small op (e.g., torch.nn.functional.gelu_backward) and write a custom decomposition that splits it into simpler primitives. Register via @register_decomposition.',
            verify: 'pytest: decomposition matches reference op to 1e-5; torch.compile uses your decomposition.',
            hours: '4h',
            resources: [R.inductor_blog, R.pytorch_custom_op],
          },
        ],
        reading: [R.inductor_blog, R.pytorch_custom_op, R.pytorch_dev_podcast],
      },
      {
        number: 15,
        title: 'Custom op + autograd + compile integration',
        goal: 'Register a custom op end-to-end: dispatcher + autograd + Inductor.',
        tasks: [
          {
            id: 'b-w15-r1',
            track: 'read',
            title: 'PyTorch custom op tutorial — TORCH_LIBRARY + autograd',
            body:
              'How to register a custom op with the dispatcher, attach an autograd implementation, and integrate with torch.compile.',
            verify: 'Notes: TORCH_LIBRARY vs torch.library.define; meta function vs eager kernel.',
            hours: '2h',
            resources: [R.pytorch_custom_op],
          },
          {
            id: 'b-w15-b1',
            track: 'build',
            title: 'Register a fused op (matmul + bias + gelu) with full integration',
            body:
              'Write the op in Triton (from your c2 skills). Register with TORCH_LIBRARY. Provide a meta function for shape inference. Add the autograd path. Add a custom Inductor lowering so torch.compile uses your kernel.',
            verify: 'pytest: matches torch.matmul + bias + gelu to 1e-3; torch.compile path uses your Triton kernel (verify via TORCH_LOGS=output_code).',
            hours: '6h',
            resources: [R.pytorch_custom_op, R.inductor_blog],
          },
          {
            id: 'b-w15-a1',
            track: 'apply',
            title: 'Weekly post — "Adding a custom op to torch.compile"',
            body:
              '400 words. The full registration sequence as a numbered list. One screenshot of TORCH_LOGS=output_code showing your kernel firing. The kind of post compiler-team recruiters bookmark.',
            verify: 'Post live; code snippet inline.',
            hours: '2h',
          },
        ],
        reading: [R.pytorch_custom_op, R.inductor_blog, R.yang_pytorch_internals],
      },
      {
        number: 16,
        title: 'Profile + optimize a real workload',
        goal: 'Llama-3-8B inference benched with + without your custom op via torch.compile.',
        tasks: [
          {
            id: 'b-w16-b1',
            track: 'build',
            title: 'Profile Llama-3-8B forward pass with torch.compile',
            body:
              'Fourth paid Modal H100 hour. Capture torch.profiler trace + Inductor\'s generated Triton. Identify the hot kernels.',
            verify: 'docs/w16-profile.md with the top-5 kernel-time entries + your fused op\'s position.',
            hours: '3h',
            resources: [R.modal_docs, R.inductor_blog],
          },
          {
            id: 'b-w16-b2',
            track: 'build',
            title: 'Substitute your fused op + re-bench',
            body:
              'Wire your W15 fused matmul+bias+gelu into the model. Re-run the profile. Did your kernel reduce time? By how much?',
            verify: 'Before/after numbers in BENCHMARKS row; honest paragraph if it didn\'t help (often the case for small ops).',
            hours: '3h',
          },
          {
            id: 'b-w16-a1',
            track: 'apply',
            title: 'Long-form post — "torch.compile gotchas I hit"',
            body:
              'The post that signals "I have shipped real compile-path work." ~1200 words. 3-5 gotchas with the fix. Twitter/X + LinkedIn cross-post.',
            verify: 'Post live; shared in at least one PyTorch-related Discord or Slack.',
            hours: '4h',
          },
          {
            id: 'b-w16-p1',
            track: 'prep',
            title: 'System-design page 3 — "Explain autograd internals to a compiler interviewer"',
            body:
              'Fill the empty W0 page 3. Forward graph construction, backward via reverse-mode chain rule, the role of the dispatcher in routing. Practice in 25 min.',
            verify: 'Page filled; 25-min self-presentation rehearsed.',
            hours: '2.5h',
            resources: [R.yang_pytorch_internals],
          },
        ],
        reading: [R.inductor_blog, R.pytorch_custom_op, R.modular_blog],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // P5 — Production Compilers (W17-W20)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b-phase-5',
    title: 'Phase 5 — Production Compilers',
    blurb: 'IREE, TVM Unity, JAX Pallas, Modular Mojo. Read + run + sketch a contribution.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-edge-ai),',
    artifact: 'A read-and-compare writeup across 4 production ML compilers, plus 1 scouted OSS issue per stack',
    context:
      'P5 is breadth, not depth. You will not become an IREE expert in a week. You WILL be able to compare four production stacks fluently in an interview, identify one credible OSS contribution per stack, and pick a winner for P6\'s actual PR. The compare-and-contrast is itself an interview asset.',
    weeks: [
      {
        number: 17,
        title: 'IREE — build, run, read',
        goal: 'IREE built locally. A small model running through it. One scouted issue identified.',
        tasks: [
          {
            id: 'b-w17-r1',
            track: 'read',
            title: 'IREE architecture docs — input dialect, Stream, HAL',
            body:
              'IREE\'s pipeline is the cleanest MLIR-based production stack. Map their dialect progression to your c3 mental model.',
            verify: 'Notes: IREE\'s pipeline in one paragraph; Stream dialect\'s role explained.',
            hours: '3h',
            resources: [R.iree_docs],
          },
          {
            id: 'b-w17-b1',
            track: 'build',
            title: 'Build IREE locally + run MobileNet',
            body:
              'Clone, configure, build. Compile MobileNet through IREE. Run on CPU or Vulkan (CUDA backend requires more setup).',
            verify: 'iree-compile produces a .vmfb; iree-run-module produces correct inference output.',
            hours: '4h',
            resources: [R.iree_docs, R.iree_repo],
          },
          {
            id: 'b-w17-a1',
            track: 'apply',
            title: 'Scout 1 good-first-issue in iree-org/iree',
            body:
              'Browse issues with "good first issue" or "help wanted". Pick one you could realistically ship in 1-2 weeks. Comment "I\'m looking at this".',
            verify: 'docs/oss-scouting.md with the issue link + 3-sentence approach + estimated LOC.',
            hours: '1.5h',
          },
        ],
        reading: [R.iree_docs, R.iree_repo, R.mlir_passes],
      },
      {
        number: 18,
        title: 'TVM Unity — Relax + MetaSchedule',
        goal: 'Compiled a model through TVM Unity. Read the Relax dialect docs.',
        tasks: [
          {
            id: 'b-w18-r1',
            track: 'read',
            title: 'TVM paper + Unity transition docs',
            body:
              'TVM original paper (§3-4) is the bedrock; Unity is the modern rewrite. Read both. TVM\'s scheduling-search approach contrasts cleanly with MLIR\'s pass-pipeline approach.',
            verify: 'Notes: TVM\'s AutoTVM vs MLIR\'s lowering pipeline in one paragraph each.',
            hours: '3h',
            resources: [R.tvm_paper, R.tvm_repo],
          },
          {
            id: 'b-w18-b1',
            track: 'build',
            title: 'Compile a small model through TVM Unity',
            body:
              'Use TVM Unity with Relax to compile a 3-layer MLP. Print the generated kernel. Note: TVM Unity is in flux; verify the API before deep-diving.',
            verify: 'tvm.relax.build produces a Module; one inference run succeeds.',
            hours: '4h',
            resources: [R.tvm_repo],
          },
          {
            id: 'b-w18-a1',
            track: 'apply',
            title: 'Scout 1 good-first-issue in apache/tvm',
            body:
              'Same drill as W17 — find a tractable issue, comment.',
            verify: 'docs/oss-scouting.md updated with the TVM issue.',
            hours: '1.5h',
          },
        ],
        reading: [R.tvm_paper, R.tvm_repo, R.hidet_paper],
      },
      {
        number: 19,
        title: 'JAX + Pallas',
        goal: 'A Pallas kernel for one transformer block component.',
        tasks: [
          {
            id: 'b-w19-r1',
            track: 'read',
            title: 'Pallas docs + Pallas-on-GPU examples',
            body:
              'Pallas is JAX\'s kernel DSL. Triton-like syntax with JAX semantics. Required if applying to DeepMind/Google.',
            verify: 'Notes: Pallas\'s pl.BlockSpec; how Pallas-on-GPU differs from Triton.',
            hours: '3h',
            resources: [R.pallas_docs],
          },
          {
            id: 'b-w19-b1',
            track: 'build',
            title: 'A Pallas kernel for fused softmax',
            body:
              'Port your Triton fused softmax (from W5) to Pallas. Compare API differences in your notes.',
            verify: 'pytest: matches jax.nn.softmax to 1e-5; commit + notes on API differences.',
            hours: '4h',
            resources: [R.pallas_docs],
          },
        ],
        reading: [R.pallas_docs, R.tvm_repo],
      },
      {
        number: 20,
        title: 'Modular MAX + Mojo',
        goal: 'Read what\'s public about Mojo + MAX. Sketch how their compilation strategy differs from MLIR-stock.',
        tasks: [
          {
            id: 'b-w20-r1',
            track: 'read',
            title: 'Mojo documentation + Modular engineering blog (top 5 posts)',
            body:
              'Mojo is Chris Lattner\'s post-MLIR language. Built on MLIR with autotuning + simd primitives baked in. Required reading before applying to Modular.',
            verify: 'Notes: Mojo\'s relationship to MLIR + Python; one example of an @autotune.',
            hours: '3h',
            resources: [R.mojo_docs, R.modular_blog],
          },
          {
            id: 'b-w20-b1',
            track: 'build',
            title: 'A Mojo kernel — if accessible — or a Mojo-style writeup',
            body:
              'If Mojo Playground is accessible: write a small kernel. Otherwise: a 500-word analysis of "what Mojo does that MLIR-stock doesn\'t" with code examples from the docs.',
            verify: 'Either a Mojo file + run output, OR docs/mojo-analysis.md committed.',
            hours: '4h',
            resources: [R.mojo_docs],
          },
          {
            id: 'b-w20-a1',
            track: 'apply',
            title: 'Comparison writeup — "Four ML compilers walked into a bar"',
            body:
              'Long-form post comparing IREE / TVM / JAX-Pallas / Mojo on: scheduling strategy, target hardware coverage, autotuning approach, kernel-DSL ergonomics. ~1500 words. This is the post that signals "I have a compiler-eng-level mental map of the field."',
            verify: 'Post live; shared in at least one ML-compiler-adjacent Discord or Slack.',
            hours: '4h',
          },
        ],
        reading: [R.mojo_docs, R.modular_blog, R.pallas_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // P6 — Land (W21-W24)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b-phase-6',
    title: 'Phase 6 — Land',
    blurb: 'Two OSS PRs merged. Portfolio writeup. 30 targeted applications. First compiler onsite.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: '2 merged OSS PRs + portfolio writeup + ≥30 applications + ≥1 compiler-team onsite scheduled',
    context:
      'The funnel surge. Capstones are done; OSS PRs land; applications go out. Success here is screen-rate, not offer count — offers are downstream. By the end of W24 the conversation moves from "I am studying compilers" to "I have shipped compiler work; can we talk?"',
    weeks: [
      {
        number: 21,
        title: 'OSS PR #1 — MLIR or Triton',
        goal: 'One PR opened in llvm-project (MLIR) or triton-lang/triton.',
        tasks: [
          {
            id: 'b-w21-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W21',
            body:
              'Before opening an OSS compiler PR:\n' +
              '  • Issue you\'re working on is still unclaimed\n' +
              '  • Maintainer responded to your comment (or it has been ≥5 days)\n' +
              '  • You have a fork building locally with their CI commands passing\n' +
              '  • You\'ve read the project\'s CONTRIBUTING.md and signed the CLA\n' +
              'Compiler PRs have long review cycles. Setup friction at this stage costs days.',
            verify: 'All four items checked off in docs/oss-pr-1.md.',
            hours: '30m check + remediation in flight',
          },
          {
            id: 'b-w21-b1',
            track: 'build',
            title: 'Ship OSS PR #1',
            body:
              'From your W17/W18 scouted issues OR a triton-lang issue. Aim for 50-200 LOC. Include test + a clear PR description with the linked issue.',
            verify: 'PR opened against llvm-project, triton-lang/triton, OR iree-org/iree, OR apache/tvm.',
            hours: '15h',
            resources: [R.mlir_passes, R.triton_internals],
          },
          {
            id: 'b-w21-a1',
            track: 'apply',
            title: 'Weekly post — "First MLIR PR"',
            body:
              'Friday post. Link the PR. 200 words on what it does. Even if not yet merged.',
            verify: 'Post live; PR link in the thread.',
            hours: '1.5h',
          },
        ],
        reading: [R.mlir_passes, R.triton_internals],
      },
      {
        number: 22,
        title: 'OSS PR #2 + portfolio writeup',
        goal: 'PR #2 opened (different stack or same). Portfolio site reflects the journey.',
        tasks: [
          {
            id: 'b-w22-b1',
            track: 'build',
            title: 'Ship OSS PR #2',
            body:
              'Either deeper in the same stack (good if reviewers liked PR #1), or a different stack (good for breadth signal). Same quality bar: tests + clear description.',
            verify: 'PR #2 opened; both PRs linked from your portfolio site.',
            hours: '12h',
          },
          {
            id: 'b-w22-a1',
            track: 'apply',
            title: 'Portfolio writeup — the compiler journey',
            body:
              'Long-form post on your personal site. Pinned. Tells the arc: inference engineer → built c1 dialect → built c2 FA-2 reproduction → built c3 e2e compiler → shipping OSS. 2000 words max. This is the document you link in cold applications.',
            verify: 'Page live at /portfolio or /compiler-journey; pinned in LinkedIn Featured.',
            hours: '5h',
          },
          {
            id: 'b-w22-p1',
            track: 'prep',
            title: 'System-design page 4 — "Design a fusion algorithm"',
            body:
              'Fill the last W0 page. Tile-graph fusion (Welder-style) vs greedy producer-consumer (Inductor-style). Tradeoffs. Practice in 25 min.',
            verify: 'Page filled; 25-min self-presentation rehearsed.',
            hours: '2.5h',
            resources: [R.welder_paper, R.inductor_blog],
          },
        ],
        reading: [R.welder_paper, R.hidet_paper],
      },
      {
        number: 23,
        title: 'Outreach surge',
        goal: '30 applications submitted, 5 named-referrer warm intros, 3 mock interviews scheduled.',
        tasks: [
          {
            id: 'b-w23-a1',
            track: 'apply',
            title: '30 targeted applications — Tier A + B + C from W0 list',
            body:
              'Tailored cover paragraph per company (re-use a template + 3 sentences per role). Always lead with: c1 link, c2 number, c3 repo, OSS PR link. The portfolio writeup is the cover-letter substitute.',
            verify: '30 applications logged in docs/applications.md with submission date + status column.',
            hours: '10h',
          },
          {
            id: 'b-w23-a2',
            track: 'apply',
            title: '5 referrer DMs — warm intros',
            body:
              'For your top 5 target companies: a DM to a named engineer asking for a referral. The portfolio writeup is the attachment; do NOT include resume in the DM (offer to send on request).',
            verify: '5 DMs sent; replies tracked in docs/outreach.md.',
            hours: '3h',
          },
          {
            id: 'b-w23-p1',
            track: 'prep',
            title: 'Book 3 mock interviews — compiler / kernel focus',
            body:
              'Pramp, interviewing.io, or peers. Compiler-eng mocks are sparse — kernel-optimization or systems mocks are the closest. Book for W24.',
            verify: '3 mock interviews on calendar.',
            hours: '1.5h',
          },
        ],
        reading: [R.huyen_ml_interview, R.donne_martin],
      },
      {
        number: 24,
        title: 'Interview ramp + first onsite',
        goal: 'First compiler-team onsite scheduled. Loop feedback documented. Funnel sustained.',
        tasks: [
          {
            id: 'b-w24-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before onsite',
            body:
              'Can you do these cold?\n' +
              '  • Walk through your c1 / c2 / c3 in 5 minutes each, without slides\n' +
              '  • Derive backprop for one MLP layer + softmax Jacobian\n' +
              '  • Sketch a tile-graph fusion for a fused-MLP block on a whiteboard\n' +
              '  • CodeSignal-style 90-min coding at 100% accuracy\n' +
              'Reds here are the difference between "screen passed" and "screen rejected". DO NOT skip.',
            verify: 'Self-check; remediation done if any rating <3.',
            hours: '1h check + variable remediation',
            resources: [R.huyen_ml_interview],
          },
          {
            id: 'b-w24-p1',
            track: 'prep',
            title: '3 mock interviews — kernel optimization + system design',
            body:
              'Use the W23 bookings. Take notes from each loop; share thank-you within 24h.',
            verify: '3 mock interviews completed; feedback notes in docs/mocks.md.',
            hours: '6h',
          },
          {
            id: 'b-w24-a1',
            track: 'apply',
            title: 'First compiler-team onsite + ongoing follow-ups',
            body:
              'At least 1 onsite scheduled (target). For any onsite this week: lead with c1 walkthrough, then c2 number, then c3 e2e. Take notes from each loop; thank-you within 24h.',
            verify: '1+ onsite scheduled; follow-up email sent within 24h of every loop.',
            hours: '8h',
          },
          {
            id: 'b-w24-a2',
            track: 'apply',
            title: 'W24 wrap post — "24 weeks, here\'s what shipped"',
            body:
              'The closing post. Numbers: c1 LOC, c2 % of torch SDPA, c3 e2e demo, OSS PR links, application count, screen-rate. Honest. Even if the offer hasn\'t landed yet — the funnel is the artifact.',
            verify: 'Post live; both Twitter/X + LinkedIn cross-posted.',
            hours: '2h',
          },
        ],
        reading: [R.huyen_ml_interview, R.donne_martin],
      },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────
// Helpers — mirror north-plan's surface so the timeline component works.
// ────────────────────────────────────────────────────────────────────────

export function getWeek(num: number): { phase: Phase; week: Week } | null {
  for (const phase of PATH) {
    const week = phase.weeks.find((w) => w.number === num)
    if (week) return { phase, week }
  }
  return null
}

function parseHours(h?: string): number {
  if (!h) return 0
  const match = h.match(/(\d+(?:\.\d+)?)\s*h/i)
  if (match) return Number(match[1])
  const mins = h.match(/(\d+)\s*m/i)
  if (mins) return Number(mins[1]) / 60
  return 0
}

export function weekHours(week: Week): number {
  let total = 0
  for (const t of week.tasks) total += parseHours(t.hours)
  return total
}

export const DENSE_WEEK_THRESHOLD_HOURS = 22

export function isDenseWeek(week: Week): boolean {
  return weekHours(week) > DENSE_WEEK_THRESHOLD_HOURS
}

export function periodLabel(_phase: Phase, week: Week): string {
  return `W${week.number}`
}

export type YearGroup = {
  year: 0 | 1 | 2 | 3
  cadence: 'week' | 'quarter'
  weeks: { phase: Phase; week: Week }[]
}

export function periodSpan(periodId: number): [number, number] {
  return [periodId, periodId]
}

export function totalGlobalWeeks(): number {
  let total = 0
  for (const phase of PATH) total += phase.weeks.length
  return total
}

export function maxGlobalWeek(): number {
  return totalGlobalWeeks() - 1
}

export function allTasks(): Task[] {
  const out: Task[] = []
  for (const phase of PATH) for (const week of phase.weeks) for (const t of week.tasks) out.push(t)
  return out
}

export function periodAtGlobalWeek(g: number): { phase: Phase; week: Week } | null {
  let idx = 0
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      if (idx === g) return { phase, week }
      idx++
    }
  }
  return null
}

export function periodIndexInPhase(phase: Phase, week: Week): number {
  return phase.weeks.findIndex((w) => w.number === week.number)
}

export const BLUE_RESOURCES: Record<string, Resource> = R
