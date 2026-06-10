/**
 * North — the 12-week hire sprint for Jai.
 *
 * Atlas is the multi-year arc. North is the 90-day shipping plan that sits on
 * top of it and answers one question:
 *
 *   "What do I build, read, ship, and apply this week so that by W12 I have a
 *    portfolio dense enough to earn ≥30% screen-rate from teams that will
 *    actually talk to a Varanasi-based candidate (no local AI scene; nearest
 *    hubs are Bangalore / Hyderabad / Gurgaon ~1500 km away) for an LLM
 *    Infrastructure / Inference Engineer role?"
 *
 * Mission:
 *   Senior SWE  →  LLM Inference / AI Systems Engineer in ~12 weeks.
 *
 * Strategy (revised 2026-05-25 after deep-research convergence + Atlas alignment):
 *   1. Ship TWO deep flagship portfolio projects + one optional:
 *      P1: mini-vLLM         — paged KV cache, continuous batching, OpenAI API,
 *                              one accelerator (quant OR specdec), in-loop NCU
 *                              (NVIDIA Nsight Compute — the GPU kernel profiler)
 *                              profiling baked in from W2 onward. THE centerpiece.
 *      P2: merged vLLM / SGLang PR — promoted from "side goal" to *flagship*.
 *                              The hiring manager at Anthropic / Together / Modal
 *                              opens GitHub before they open your résumé. Aim:
 *                              design-comment-acked PR open by W6; FIRST PR merged
 *                              by W8; THREE PRs by W12 (vLLM ≥ 1, SGLang ≥ 1,
 *                              third one anywhere — FlashInfer, Triton, llama.cpp).
 *      P3-optional: dist-inference — TP (tensor parallelism — one model split
 *                              across GPUs) or multi-worker replica serving, scaling
 *                              bench. Keep if W1-W10 ran on schedule; drop if W6
 *                              slipped. RL-systems pivot (Atlas Year-1) uses this
 *                              W9-W10 slot for a GRPO trainer with mini-vLLM as
 *                              rollout backend — read /training/rl-systems/rollout-engines
 *                              before deciding.
 *      DEMOTED:    ai-gateway   — was a flagship; now an OPTIONAL side-week
 *                              artifact. ai-gateway is a *product-engineer* signal,
 *                              not an *inference-engineer* signal. The lane message
 *                              matters more than the artifact count. Keep W6-W7
 *                              ai-gateway code as a portfolio side-bullet only;
 *                              do NOT lead résumé with it.
 *      (Applied AI side-quest: 2-day RAG demo in W7 stays as breadth bullet.)
 *   2. **Anthropic Fellows Program — PARALLEL APPLICATION TRACK from W4.**
 *      Remote, no-PhD, no-prior-ML required. $3,850/wk + $15K/mo compute. ~40%
 *      FTE conversion. The single highest-EV credential available without a PhD,
 *      especially for an India-based candidate where US-onsite loops are slow.
 *      Apply during W4-W6 window; pitch an RL post-training or interpretability
 *      project. Worst case: rejected, North proceeds. Best case: skip the funnel.
 *   3. Build a system-design library of 5 one-pagers for interviews.
 *   4. Open 25+ targeted outreach threads. Convert. Bias 70/30 toward India-remote-
 *      friendly orgs in cycle 1 (Anthropic, Together, Modal, Anyscale, Sarvam,
 *      Krutrim, NVIDIA-India, Perplexity, Cohere); US-onsite is cycle 2.
 *
 * Compute posture — FREE FIRST, paid only for headline numbers:
 *   - Kaggle Notebooks  — 30h/wk on dual T4 (32 GB total via 2× T4). The default
 *                         dev environment for W0–W5. Llama-3-8B fp16 is tight on
 *                         16 GB but fine in int8 / on 4-bit; full fp16 testing
 *                         can use the dual-T4 split or shrink to Llama-3-1B / 3-3B.
 *   - Colab free        — T4 sometimes, time-capped. Fallback only.
 *   - Lightning Studios — limited free credits; useful for one-off A100 runs.
 *   - PAID (Modal/RunPod) — H100/A100 only for the FIVE headline runs that
 *                         end up in BENCHMARKS.md / on your resume:
 *                           (a) W2 baseline decode NCU snapshot (~1h)
 *                           (b) W4 continuous-batching scheduler profile (~1h)
 *                           (c) W7 ai-gateway 100-RPS load test (~1h, optional —
 *                               can run against mocked providers locally if budget
 *                               is tight)
 *                           (d) W8 Triton matmul NCU report (~1.5h)
 *                           (e) W9 dist-inference scaling chart (~2h)
 *                         Budget cap: ~$50–$150 total over 12wk. Set a HARD
 *                         monthly cap in Modal's dashboard on day one.
 *
 * Tracks (mirror Atlas):
 *   read   — papers, blogs, docs that earn the right to build
 *   build  — code that runs and produces a number on a benchmark
 *   apply  — visible artifact: PR, README, demo, application, DM
 *   prep   — interview prep, system-design study, mock loops, OSS scouting
 *
 * Half-lives:
 *   durable — attention primitive, KV cache, autoregressive mechanics, roofline
 *             (the compute-vs-memory-bandwidth performance-ceiling model)
 *             intuition, distributed primitives. ~10y stable.
 *   medium  — vLLM scheduler patterns, paged-attention block layout, current
 *             quant recipes, FA versions. ~3-5y.
 *   fast    — specific SOTA papers (Medusa, EAGLE), exact framework APIs,
 *             current company hiring guides. ~1y. VERIFY before action.
 *
 * Slack & buffer — what to do when a week slips:
 *   Every phase is one week with zero buffer. That is fragile. Rule: if you are
 *   ≥2 days behind on a Wednesday, DROP the lowest-priority prep task (Leetcode
 *   that week, OR the optional build) and protect the read+build+apply spine.
 *   Do NOT roll work forward — rolled work compounds and kills the sprint by W6.
 *
 * Brutal-honesty notes (from research + Atlas's own posture):
 *   - Funnel & geography are real gaps. Varanasi-based + <5 mo runway means:
 *     (a) zero local AI scene, (b) most US-onsite serving-infra roles will
 *     not close in time. Indian AI Tier A (NVIDIA India / Google DeepMind
 *     India / Sarvam / Krutrim / AI4Bharat) clusters in Bangalore + Hyderabad
 *     + Gurgaon, but traveling for a 1–2 day onsite is easy, so the interview
 *     funnel stays mostly intact. Relocation is a question that only triggers
 *     AT offer time, not before. W0-a3 audit verifies (1) does the company
 *     hire from India, (2) is the team open to India-remote OR willing to
 *     onboard you remote with eventual relocation.
 *   - Mini-vLLM is the single highest-ROI portfolio artifact for this lane.
 *     A landed merge PR in vLLM/SGLang beats a half-built clone.
 *   - "OpenAI-compatible API" is table stakes. Without it, no recruiter cares.
 *   - Every project must have a BENCHMARKS.md with hardware, batch, dtype,
 *     and three numbers: TTFT, ITL/throughput, memory. No numbers = no project.
 *   - Cold applications without referrals fail. Build-in-public starts W0
 *     (weekly post); first cold DMs go out W4; surge in W11. By W12 the
 *     funnel should be inbound-augmented, not pure cold-outbound.
 *   - GPU intuition is threaded through W2/W4 (NCU profile of the scheduler
 *     iteration), not bottled in W8. One Triton week is necessary, not enough.
 *   - North is not Atlas-lite. Atlas covers bedrock (math, OS, arch, compilers).
 *     North trusts that and runs flat-out on infra/serving for 12 weeks. Each
 *     week W1-W12 carries its OWN "Prerequisites" task at the top of its task
 *     list that names the specific bedrock concepts the week depends on and
 *     points at a remediation resource for each. Smooth: open the week, scan
 *     the prereqs, fill any gap right there, execute. No global pre-flight
 *     audit, no jumping between weeks.
 *   - Success metric for W12 is NOT "have an offer." It is "≥30% screen-rate
 *     across ≥45 applications + ≥3 referrer warm-intros + ≥1 onsite scheduled."
 *     Offers are downstream and partially out of your control.
 */

// Reuse all the Atlas types and metadata so North inherits the same shape
// (and so a single set of CSS rules / progress patterns / disclosures cover both).
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
// Resource library — curated, lean. Inlined here so North is standalone.
// ────────────────────────────────────────────────────────────────────────

const R = {
  // ── Inference fundamentals ────────────────────────────────────────────
  weng_inference: {
    kind: 'blog',
    title: 'Lilian Weng — Large Transformer Model Inference Optimization',
    url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/',
    hours: '1.5h',
    why: 'The single best mental-model overview of inference optimization. Read first.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  kipperly_speed: {
    kind: 'blog',
    title: 'Horace He — Making Deep Learning Go Brrr From First Principles',
    url: 'https://horace.io/brrr_intro.html',
    hours: '1h',
    why: 'Compute vs memory vs overhead. The lens for every inference decision.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  pagedattention: {
    kind: 'paper',
    title: 'Kwon et al — Efficient Memory Management for LLM Serving with PagedAttention',
    url: 'https://arxiv.org/abs/2309.06180',
    hours: '2h',
    why: 'The paper that defined modern LLM serving. KV cache as paged memory.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  orca: {
    kind: 'paper',
    title: 'Orca — A Distributed Serving System for Transformer-Based Generative Models',
    url: 'https://www.usenix.org/conference/osdi22/presentation/yu',
    hours: '1.5h',
    why: 'Iteration-level scheduling — the trick continuous batching is built on.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  anyscale_batching: {
    kind: 'blog',
    title: 'Anyscale — How Continuous Batching Enables 23x Throughput',
    url: 'https://www.anyscale.com/blog/continuous-batching-llm-inference',
    hours: '45m',
    why: 'Best practical writeup of continuous batching. Pictures + numbers.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  sarathi_serve: {
    kind: 'paper',
    title: 'Sarathi-Serve — Chunked Prefill for High-Throughput Serving',
    url: 'https://arxiv.org/abs/2403.02310',
    hours: '1.5h',
    why: 'Why mixing prefill + decode in one batch beats separating them.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  pope_efficient: {
    kind: 'paper',
    title: 'Pope et al — Efficiently Scaling Transformer Inference',
    url: 'https://arxiv.org/abs/2211.05102',
    hours: '2h',
    why: 'Google\'s analytical framework for serving cost at scale. TP/PP tradeoffs.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // ── Quantization + speculative decoding ───────────────────────────────
  awq: {
    kind: 'paper',
    title: 'AWQ — Activation-aware Weight Quantization',
    url: 'https://arxiv.org/abs/2306.00978',
    hours: '1h',
    why: 'Best weight-only PTQ recipe; ubiquitous in serving stacks.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  gptq: {
    kind: 'paper',
    title: 'GPTQ — Accurate Post-Training Quantization',
    url: 'https://arxiv.org/abs/2210.17323',
    hours: '1h',
    why: 'The other dominant PTQ recipe. Pair with AWQ.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  leviathan_spec: {
    kind: 'paper',
    title: 'Leviathan et al — Fast Inference from Transformers via Speculative Decoding',
    url: 'https://arxiv.org/abs/2211.17192',
    hours: '1h',
    why: 'The original speculative decoding paper. Foundational.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  medusa: {
    kind: 'paper',
    title: 'Medusa — Simple LLM Inference Acceleration with Multiple Decoding Heads',
    url: 'https://arxiv.org/abs/2401.10774',
    hours: '1h',
    why: 'Practical self-speculation without a separate draft model.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  eagle: {
    kind: 'paper',
    title: 'EAGLE — Speculative Sampling Requires Rethinking Feature Uncertainty',
    url: 'https://arxiv.org/abs/2401.15077',
    hours: '1h',
    why: 'Current SOTA spec-decoding in many open stacks. Verify version.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // ── GPU + Triton ──────────────────────────────────────────────────────
  flashattention2: {
    kind: 'paper',
    title: 'FlashAttention-2 — Faster Attention with Better Parallelism',
    url: 'https://arxiv.org/abs/2307.08691',
    hours: '2h',
    why: 'The IO-aware attention algorithm. §3 is required reading for any kernel author.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  flashattention3: {
    kind: 'paper',
    title: 'FlashAttention-3 — Fast and Accurate Attention on Hopper',
    url: 'https://arxiv.org/abs/2407.08608',
    hours: '1.5h',
    why: 'Hopper-specific: warp-specialization + WGMMA + FP8. Verify before reproducing.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,
  triton_docs: {
    kind: 'docs',
    title: 'OpenAI Triton — official tutorials',
    url: 'https://triton-lang.org/main/getting-started/tutorials/index.html',
    hours: '3h',
    why: 'Vector add → fused softmax → matmul. Three tutorials, one weekend.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  gpu_mode: {
    kind: 'video',
    title: 'GPU MODE — community lectures',
    url: 'https://www.youtube.com/@GPUMODE',
    hours: 'ongoing',
    why: 'The center of gravity for practical GPU programming. Lectures 1-2 first.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  nsight_compute: {
    kind: 'docs',
    title: 'NVIDIA Nsight Compute — getting started',
    url: 'https://docs.nvidia.com/nsight-compute/NsightComputeCli/index.html',
    hours: '2h',
    why: 'The profiler. Without NCU, you cannot verify TC utilization or roofline gap.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // ── Serving stacks (OSS) ──────────────────────────────────────────────
  vllm_repo: {
    kind: 'repo',
    title: 'vLLM',
    url: 'https://github.com/vllm-project/vllm',
    why: 'Reference open-source LLM serving engine. Read engine/, attention/, scheduler.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  sglang_repo: {
    kind: 'repo',
    title: 'SGLang',
    url: 'https://github.com/sgl-project/sglang',
    why: 'RadixAttention prefix cache + structured-output kernels; fast-moving stack.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  tgi_repo: {
    kind: 'repo',
    title: 'HuggingFace Text Generation Inference (TGI)',
    url: 'https://github.com/huggingface/text-generation-inference',
    why: 'Rust router + Python shards; another canonical serving architecture.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  llamacpp_repo: {
    kind: 'repo',
    title: 'llama.cpp',
    url: 'https://github.com/ggerganov/llama.cpp',
    why: 'CPU/Metal/CUDA inference in C++. GGUF format + quant kernels.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  tensorrt_llm: {
    kind: 'repo',
    title: 'TensorRT-LLM',
    url: 'https://github.com/NVIDIA/TensorRT-LLM',
    why: 'NVIDIA\'s production inference compiler. Worth reading for plugin/op patterns.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  litellm_repo: {
    kind: 'repo',
    title: 'LiteLLM (router source)',
    url: 'https://github.com/BerriAI/litellm',
    why: 'Read the Router class — fallback, retry, cost tracking patterns.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  hf_generate: {
    kind: 'repo',
    title: 'transformers — modeling_llama.py + generation_utils',
    url: 'https://github.com/huggingface/transformers/blob/main/src/transformers/models/llama/modeling_llama.py',
    why: 'Reference autoregressive loop. Skim before writing your own.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // ── Serving infra patterns ────────────────────────────────────────────
  fastapi_docs: {
    kind: 'docs',
    title: 'FastAPI — official docs',
    url: 'https://fastapi.tiangolo.com/',
    why: 'Async Python HTTP. The default for OpenAI-compatible inference servers.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  openai_api_ref: {
    kind: 'docs',
    title: 'OpenAI API reference — chat completions + streaming',
    url: 'https://platform.openai.com/docs/api-reference/chat',
    why: 'The interface every serving stack mimics. SSE event shape, tool calls, etc.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  otel_docs: {
    kind: 'docs',
    title: 'OpenTelemetry — Python instrumentation',
    url: 'https://opentelemetry.io/docs/languages/python/',
    why: 'Traces + metrics. Required for any "production-grade" infra claim.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  portkey_gateway: {
    kind: 'docs',
    title: 'Portkey — AI Gateway docs',
    url: 'https://portkey.ai/docs',
    why: 'Reference architecture for a real AI gateway: routing, cache, guardrails.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  cf_ai_gateway: {
    kind: 'blog',
    title: 'Cloudflare AI Gateway — what & why',
    url: 'https://blog.cloudflare.com/ai-gateway/',
    hours: '30m',
    why: 'Edge AI gateway pattern. Cache, fallback, observability at scale.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // ── RAG ───────────────────────────────────────────────────────────────
  anthropic_contextual: {
    kind: 'blog',
    title: 'Anthropic — Introducing Contextual Retrieval',
    url: 'https://www.anthropic.com/news/contextual-retrieval',
    hours: '45m',
    why: 'Current SOTA prompt-based chunk enrichment. Pair with hybrid retrieval.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  pinecone_rag: {
    kind: 'blog',
    title: 'Pinecone — RAG that actually works',
    url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
    hours: '1h',
    why: 'Production RAG patterns: chunking, hybrid, rerank, eval.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  ragas_docs: {
    kind: 'docs',
    title: 'Ragas — RAG evaluation library',
    url: 'https://docs.ragas.io/',
    why: 'Faithfulness, answer-relevancy, context-precision — the standard RAG metrics.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  bge_reranker: {
    kind: 'docs',
    title: 'BAAI BGE reranker — model card',
    url: 'https://huggingface.co/BAAI/bge-reranker-v2-m3',
    why: 'Strong open-weights cross-encoder reranker. Drop-in for production.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // ── Distributed ───────────────────────────────────────────────────────
  megatron_tp: {
    kind: 'paper',
    title: 'Megatron-LM — Training Multi-Billion Parameter Models',
    url: 'https://arxiv.org/abs/1909.08053',
    hours: '1.5h',
    why: '§2-3: the canonical tensor-parallel split for attention + MLP.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  nccl_docs: {
    kind: 'docs',
    title: 'NCCL — NVIDIA Collective Communications Library',
    url: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html',
    why: 'All-reduce, all-gather, ring vs tree. The primitives behind every parallelism scheme.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  weng_train_large: {
    kind: 'blog',
    title: 'Lilian Weng — How to Train Really Large Models on Many GPUs',
    url: 'https://lilianweng.github.io/posts/2021-09-25-train-large/',
    hours: '1h',
    why: 'DP/TP/PP/ZeRO in one sitting. Pair with Megatron paper.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // ── Interview prep ────────────────────────────────────────────────────
  huyen_ml_interview: {
    kind: 'book',
    title: 'Chip Huyen — Introduction to Machine Learning Interviews',
    url: 'https://huyenchip.com/ml-interviews-book/',
    hours: '8h',
    why: 'ML systems interview structure + system-design questions for ML roles.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  neetcode: {
    kind: 'course',
    title: 'NeetCode 150',
    url: 'https://neetcode.io/',
    hours: 'ongoing',
    why: 'Leetcode patterns. 30 min/day, mediums only.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  donne_martin: {
    kind: 'repo',
    title: 'donnemartin/system-design-primer',
    url: 'https://github.com/donnemartin/system-design-primer',
    why: 'Generic system-design refresher; pair with ML-specific framings.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,

  // ── Math refresh (durable) ───────────────────────────────────────────
  three_blue_one_brown_linalg: {
    kind: 'video',
    title: '3Blue1Brown — Essence of Linear Algebra',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
    hours: '3h',
    why: 'Visual intuition for matrices, eigenvalues, SVD, transformations. Watch at 1.5×; pair with your Math4ML notes. The lens you need for attention/projection math.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  math4ml_coursera: {
    kind: 'course',
    title: 'Mathematics for ML — Imperial / Coursera (your notes)',
    url: 'https://www.coursera.org/specializations/mathematics-machine-learning',
    why: 'You already completed this. Use as a re-orientation index, not a re-take. Diagnostic + targeted lecture rewatches only.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // ── Bedrock remediation (refresh resources for the 12 BEDROCK_DOMAINS) ─
  karpathy_zerotohero: {
    kind: 'video',
    title: 'Karpathy — Neural Networks: Zero to Hero',
    url: 'https://github.com/karpathy/nn-zero-to-hero',
    hours: '~12h',
    why: 'Highest-ROI refresh for backprop and attention. Type along; start with micrograd (2h) + "Let\'s build GPT" (2h).',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  three_blue_one_brown_calc: {
    kind: 'video',
    title: '3Blue1Brown — Essence of Calculus',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
    hours: '3h',
    why: 'Chain rule + derivatives + integrals with visual intuition. Pair with the linalg playlist for the #1 math refresh.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  annotated_transformer: {
    kind: 'blog',
    title: 'Harvard NLP — The Annotated Transformer',
    url: 'http://nlp.seas.harvard.edu/annotated-transformer/',
    hours: '2h',
    why: 'Attention Is All You Need with executable PyTorch alongside every equation. Re-anchors #10 attention-as-primitive after rust.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  boehm_matmul: {
    kind: 'blog',
    title: 'Simon Boehm — How to Optimize a CUDA Matmul Kernel',
    url: 'https://siboehm.com/articles/22/CUDA-MMM',
    hours: '1.5h',
    why: 'The best end-to-end walkthrough of GPU memory hierarchy in action — SMEM tiling, occupancy, TC engagement. Touches #5, #6, #7 simultaneously.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  hopper_whitepaper: {
    kind: 'docs',
    title: 'NVIDIA H100 / Hopper Architecture — whitepaper entry',
    url: 'https://www.nvidia.com/en-us/data-center/h100/',
    hours: '~1h',
    why: 'Authoritative H100 numbers: peak FLOPs, HBM3 BW, L2/SMEM sizes, wgmma shapes. Memorize the numbers page (#5, #6, #7).',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  hopper_tuning_guide: {
    kind: 'docs',
    title: 'NVIDIA — Hopper Tuning Guide',
    url: 'https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html',
    hours: '1h',
    why: 'Tensor Core shape constraints + async pipeline (TMA, wgmma, mbarrier). The #6 anchor — when matmuls silently fall back to CUDA cores, this guide explains why.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  williams_roofline: {
    kind: 'paper',
    title: 'Williams, Waterman, Patterson — Roofline: An Insightful Visual Performance Model',
    url: 'https://dl.acm.org/doi/10.1145/1498765.1498785',
    hours: '1h',
    why: 'The original roofline paper (CACM 2009). §1-3 are enough; the diagnostic frame is the durable contribution (#7).',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  ostep: {
    kind: 'book',
    title: 'OSTEP — Operating Systems: Three Easy Pieces',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    hours: '~4h',
    why: 'Free, canonical. Memory virtualization (chs 13-17) is the #3 anchor and pays off when reading PagedAttention.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  csapp_memory: {
    kind: 'book',
    title: 'CSAPP — chapter 6, The Memory Hierarchy (Bryant & O\'Hallaron)',
    url: 'https://csapp.cs.cmu.edu/',
    hours: '2h',
    why: 'Caches, locality, false sharing — the #4 architecture refresh that grounds every perf intuition.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  drepper_memory: {
    kind: 'paper',
    title: 'Drepper — What Every Programmer Should Know About Memory (part 1)',
    url: 'https://akkadia.org/drepper/cpumemory.pdf',
    hours: '1h',
    why: 'Companion to CSAPP ch 6. Part 1 alone is enough for the #4 refresh.',
    tier: 2,
    halfLife: 'durable',
  } as Resource,
  cpp_atomics: {
    kind: 'video',
    title: 'Sutter — atomic<> Weapons (talk + post)',
    url: 'https://herbsutter.com/2013/02/11/atomic-weapons-the-c-memory-model-and-modern-hardware/',
    hours: '2h',
    why: 'The C++ memory model in one talk. #2 bedrock. DEFER for North (Triton is Python); revisit when writing CUDA C++ kernels.',
    tier: 2,
    halfLife: 'durable',
  } as Resource,
  cornell_6120: {
    kind: 'course',
    title: 'Cornell CS 6120 — Advanced Compilers (Adrian Sampson)',
    url: 'https://www.cs.cornell.edu/courses/cs6120/',
    hours: '~4h',
    why: 'SSA, dataflow, IR design (lectures 1-4). The #8 refresh. DEFER for North; revisit with Triton/MLIR work.',
    tier: 2,
    halfLife: 'durable',
  } as Resource,
  yang_pytorch_internals: {
    kind: 'blog',
    title: 'Edward Yang — PyTorch Internals',
    url: 'http://blog.ezyang.com/2019/05/pytorch-internals/',
    hours: '1h',
    why: 'Dispatcher, tensor strides, autograd graph. #11 backprop/autograd refresh after Karpathy.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  paper_reading_method: {
    kind: 'paper',
    title: 'Keshav — How to Read a Paper (+ Schulman — ML Research)',
    url: 'https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf',
    hours: '~1.5h',
    why: 'Keshav 3-pass method + Schulman opinionated guide (joschu.net/blog/opinionated-guide-ml-research.html). #12 anchor — compounds across every paper.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // ── Compute (free-first) ─────────────────────────────────────────────
  kaggle_gpu: {
    kind: 'docs',
    title: 'Kaggle Notebooks — free dual-T4 GPU, 30h/wk',
    url: 'https://www.kaggle.com/docs/notebooks#gpu-and-tpu-quota',
    why: 'Default dev environment for W0–W5. 2× T4 = 32 GB total HBM. Verify your phone number to enable GPU. Cannot serve a public HTTP endpoint from a notebook — use it for engine dev + offline benchmarks, not the FastAPI server.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  colab_free: {
    kind: 'docs',
    title: 'Google Colab — free tier (T4, time-capped)',
    url: 'https://research.google.com/colaboratory/faq.html',
    why: 'Fallback when Kaggle quota is exhausted. T4 only, idle-timeouts, no SSH. Useful for one-off paper repro and reading-track notebooks.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  lightning_studio: {
    kind: 'docs',
    title: 'Lightning AI Studios — free credits',
    url: 'https://lightning.ai/pricing',
    why: 'Persistent studio environment with limited free GPU credits. Good for one-off A100 reproductions when Kaggle is not enough.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,
  modal_docs: {
    kind: 'docs',
    title: 'Modal — serverless GPU (PAID, headline runs only)',
    url: 'https://modal.com/docs',
    why: 'Spend the $50–$150 budget here on H100/A100 for the FOUR runs that go in BENCHMARKS.md (W2, W4, W8, W9). Set a hard monthly cap in the dashboard.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // ── Mosaic internal pointers ─────────────────────────────────────────
  mosaic_ml_execution: {
    kind: 'mosaic',
    title: 'Mosaic — ML Execution track',
    url: '/ml-execution',
    why: 'Your own notes on KV cache, paged attention, quant — keep in sync.',
    halfLife: 'medium',
  } as Resource,
  mosaic_applied: {
    kind: 'mosaic',
    title: 'Mosaic — Applied AI track',
    url: '/applied',
    why: 'RAG, agent patterns, OSS contribution playbook.',
    halfLife: 'medium',
  } as Resource,
  mosaic_compilers: {
    kind: 'mosaic',
    title: 'Mosaic — Compilers track',
    url: '/compilers',
    why: 'Triton / MLIR / XLA pointers for the W8 GPU intuition week.',
    halfLife: 'medium',
  } as Resource,
} as const

// ────────────────────────────────────────────────────────────────────────
// PATH — the 13-period (W0..W12) sprint.
// All periods are 'week' cadence — North has no quarters. The global spine
// is therefore a flat 13-week stretch matching the period numbers 1:1.
// ────────────────────────────────────────────────────────────────────────

export const PATH: Phase[] = [
  // ════════════════════════════════════════════════════════════════════
  // W0 — Sprint Calibration
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-0',
    title: 'Phase 0 — Sprint Calibration',
    blurb: 'Tracker, hardware, target list, baseline. Five days, no more.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'north-portfolio meta-repo + 25-name tiered target list + Kaggle+Modal GPU access + funnel audit + public-presence kickoff',
    context:
      'No content yet — just the rails for a 90-day shipping sprint. If setup spills past the week, rip out the friction (different cloud, different account, simpler stack) before starting W1. The mistake is treating W0 as "preparing to start"; the right frame is "everything I need to run flat-out for 12 weeks is committed to git by Friday."',
    weeks: [
      {
        number: 0,
        title: 'Setup',
        goal:
          'Cloud GPU working. Portfolio repo + 4 project skeletons committed. 15 target companies + 10 OSS PR candidates listed. LinkedIn updated.',
        tasks: [
          {
            id: 'n-w0-r1',
            track: 'read',
            title: 'Weng — Large Transformer Inference Optimization (first pass)',
            body: 'Read once at normal speed. You will return to it every week of this sprint.',
            verify: 'One-paragraph summary of the four optimization axes (compute / memory / batching / quant) in your notes',
            hours: '1.5h',
            resources: [R.weng_inference],
          },
          {
            id: 'n-w0-r2',
            track: 'read',
            title: 'Survey the four serving stacks',
            body:
              'Open the README + top-level architecture doc for vLLM, SGLang, TGI, and llama.cpp. Do NOT clone yet. Just understand the shape: what is the engine boundary, what is the scheduler boundary, what is the OpenAI-compat layer.',
            verify: 'Table in notes: stack | language | scheduler | OpenAI-compat | TP support (TP = tensor parallelism, splitting one model across GPUs)',
            hours: '1.5h',
            resources: [R.vllm_repo, R.sglang_repo, R.tgi_repo, R.llamacpp_repo],
          },
          {
            id: 'n-w0-b1',
            track: 'build',
            title: 'GPU pipeline — Kaggle (free, default) + Modal (paid, headlines)',
            body:
              'Two environments, both working by Friday. (1) Kaggle: enable GPU on a notebook, run `!nvidia-smi`, confirm 2× T4. This is your daily dev box for W0–W5. (2) Modal: sign up, attach billing, set monthly cap = $40, run `modal run nvidia-smi` on an H100. This is reserved for the four headline benchmark runs (W2, W4, W8, W9). Do NOT use Modal for daily dev — you will burn the budget.',
            verify:
              'Kaggle notebook prints `Tesla T4` ×2 and runs HF `from_pretrained` on a 1B model end-to-end; Modal H100 boots and prints H100; Modal dashboard shows hard cap $40/mo set',
            hours: '1.5h',
            resources: [R.kaggle_gpu, R.modal_docs, R.colab_free],
          },
          {
            id: 'n-w0-b2',
            track: 'build',
            title: 'north-portfolio meta-repo with four project skeletons',
            body:
              'Single GitHub org (or your account). One umbrella README that links the THREE flagship projects: mini-vllm, ai-gateway, dist-inference. Each project gets its own repo with a README stub stating goal + verify + bench plan. No code yet. (mini-rag-demo is created later inside W7 as a side-quest; do NOT create it now or it becomes psychological scope creep.) CONVENTION for where deliverables live this sprint: a project\'s measurement docs go in THAT project\'s repo under docs/ (so the baseline in b3 is mini-vllm/docs/baseline.md, and later BENCHMARKS.md files live in each project repo). Job-search and personal-prep docs (targets, funnel-audit, math-diagnostic) live in the north-portfolio umbrella repo under docs/.',
            verify: 'Four public repos exist (umbrella + 3 flagships); umbrella README links them; each child README has a Verify + Bench section',
            hours: '1.5h',
          },
          {
            id: 'n-w0-b3',
            track: 'build',
            title: 'Baseline: run HF Llama-3-8B generate() on your GPU, get TTFT + ITL numbers',
            body:
              'No framework, no batching, no streaming — just `model.generate(...)` on a single prompt. Measure TTFT (time-to-first-token) and ITL (inter-token latency) at batch=1, prompt=512, gen=128. This is your starting baseline; every project will be measured against it. Write the result to mini-vllm/docs/baseline.md (the mini-vllm repo you created in b2; make the docs/ folder if it does not exist).',
            verify: 'mini-vllm/docs/baseline.md committed with hardware, model, dtype, TTFT, ITL, peak memory',
            hours: '2h',
            resources: [R.hf_generate],
          },
          {
            id: 'n-w0-a1',
            track: 'apply',
            title: 'LinkedIn headline + about → "LLM Infrastructure / Inference Engineer"',
            body:
              'No announcement post, no fanfare. Just hygiene: headline, about paragraph, experience descriptions that surface systems/infra work (perf, scale, latency, throughput, distributed). Strip generic "full-stack" language.',
            verify: 'Profile live; recruiter-search keywords (inference, vLLM, LLM serving, CUDA, Triton) present',
            hours: '1h',
          },
          {
            id: 'n-w0-a2',
            track: 'apply',
            title: 'Target list — 25 companies, tiered by who-can-actually-hire-you',
            body:
              'Re-tier from "dream list" to "honest funnel." Four tiers:\n' +
              '  Tier A (India-onsite or India-remote-friendly): NVIDIA India, Google DeepMind India, Microsoft AI India, Hugging Face, AI4Bharat, Sarvam, Krutrim, OLA Krutrim, Fractal, plus any global serving-infra startup that explicitly hires India-remote.\n' +
              '  Tier B (global remote-first, no visa needed): Replicate, OpenPipe, Modal (verify), Baseten (verify), smaller AI-infra startups that hire globally.\n' +
              '  Tier C (visa-sponsoring, long lead): Together, Anyscale, Fireworks, frontier labs. Apply but treat as 6–12 mo conversion, not 3 mo.\n' +
              '  Tier D (aspirational stretches): keep to ≤3 names. These are the "shoot your shot" plays, not the spine of the funnel.\n' +
              'Goal split: 8 A, 8 B, 6 C, 3 D. For each: role title, current openings URL, named referrer candidate (LinkedIn URL). OSS: 10 "good first issue" tickets across vLLM/SGLang/TGI/llama.cpp.',
            verify:
              'north-portfolio/docs/targets.md committed (umbrella repo) with 25 companies tiered A/B/C/D, named referrer per row, OSS shortlist of 10 issues',
            hours: '3h',
          },
          {
            id: 'n-w0-a3',
            track: 'apply',
            title: 'Funnel reality-check — who will talk to a candidate based in India',
            body:
              'Travel-for-interview is fine — you can fly to Bangalore / Hyderabad / Gurgaon for a 1–2 day onsite from Varanasi without it being a blocker. The audit is about who runs the *process* willingly with an India-based candidate, NOT about whether you can be physically there for the onsite.\n' +
              'For every Tier-A and Tier-B company in your target list, verify by reading careers page + LinkedIn employees:\n' +
              '  (1) Does the company currently employ engineers based in India? (LinkedIn search: company + India.)\n' +
              '  (2) Is the specific team open to India-remote OR willing to onboard you remote with a relocation requirement that comes AFTER offer (not before)?\n' +
              '  (3) For Tier C (visa-sponsoring): does the company sponsor from India, and what is the typical lead time? Anything > 4 months is structurally too slow for your runway — flag those for follow-up after primary funnel converts.\n' +
              'Relocation is a downstream decision, not a W0 decision. If you get a Bangalore-onsite offer, you decide then with the actual comp number in hand — and the move is a 1-week logistics problem, not a sprint blocker.\n' +
              'If ≥18 of the 25 companies fail check (2), the funnel is structurally broken regardless of where you live — stop and re-tier before W1.',
            verify:
              'north-portfolio/docs/funnel-audit.md committed (umbrella repo) with per-company rows: india_employees(y/n) · india_remote_role_open(y/n) · onsite_required_pre_offer(y/n) · realistic(y/n). At least 10 rows green on "realistic."',
            hours: '2h',
          },
          {
            id: 'n-w0-a4',
            track: 'apply',
            title: 'Public-presence kickoff — Twitter/LinkedIn build-in-public, day 1',
            body:
              'Warm intros come from being visible, not from cold DMs. Open a Twitter/X account if you don\'t have one. Write the pinned tweet: "Senior SWE, 6 yrs, spending the next 12 weeks rebuilding the LLM-serving stack from first principles. Public log here." Same paragraph on LinkedIn. Commit to ONE public post per week (Friday) for the rest of the sprint — short, factual, what you learned + a number + a link. This is the single highest-ROI funnel change. Inbound from 1 viral thread > 50 cold DMs.',
            verify:
              'Twitter/X account live with pinned post; LinkedIn updated to match; Friday weekly-post slot on calendar for W1–W12',
            hours: '1h',
          },
          {
            id: 'n-w0-p1',
            track: 'prep',
            title: 'Calendar block — 20h/wk for 12 weeks',
            body:
              'Recurring blocks. The plan assumes ~20 focused hours/wk. Block them as immovable. If your day job leaks past these blocks for two weeks in a row, the sprint is dead — say it out loud now.',
            verify: 'Recurring 20h/wk on calendar through W12',
            hours: '30m',
          },
          {
            id: 'n-w0-p2',
            track: 'prep',
            title: 'System-design notebook — one Obsidian/Notion file per question',
            body:
              'Pre-create 5 empty system-design pages, one per interview question you will study: (1) inference service, (2) AI gateway, (3) multi-tenant AI platform, (4) distributed batch inference, (5) embeddings + vector search at scale. You will fill these across W4/W6/W7/W9/W10.',
            verify: 'Five empty pages exist with the same template (problem / constraints / arch / tradeoffs / numbers)',
            hours: '30m',
          },
          {
            id: 'n-w0-p3',
            track: 'prep',
            title: 'Subscribe — Interconnects, Import AI, GPU MODE, Hao AI lab',
            body:
              'The Living Layer (see disclosure above). 30 min/wk to skim. You cannot read every paper; you can read these four channels.',
            verify: 'RSS / email subs active; first issues skimmed',
            hours: '30m',
          },
          {
            id: 'n-w0-p4',
            track: 'prep',
            title: 'Math diagnostic + targeted refresh (linalg)',
            body:
              'You completed Math4ML in 2023 but the muscle has atrophied. Run a 30-min diagnostic: by hand on paper, (a) derive softmax\'s Jacobian, (b) compute the FLOPs of a (B, S, D) × (D, D) matmul, (c) explain why attention is O(S²·D) memory-bound at decode time, (d) write the SVD of a 3×3 matrix you make up. If you stall on ≥2 of 4, watch 3Blue1Brown Essence of Linear Algebra (~3h) at 1.5× this week. The goal is not mastery; it is making sure W2/W4/W8 roofline reasoning (the compute-vs-memory-bandwidth performance-ceiling model) is not blocked by rust. Defer probability/stats refresh to W1.',
            verify:
              'north-portfolio/docs/math-diagnostic.md committed (umbrella repo) with the four answers + a self-rating (1-5) on each; 3B1B watched if rating < 3 on any',
            hours: '2h',
            resources: [R.three_blue_one_brown_linalg, R.math4ml_coursera],
          },
        ],
        reading: [R.weng_inference, R.kipperly_speed, R.vllm_repo, R.openai_api_ref],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W1 — Inference Mental Model
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-1',
    title: 'Phase 1 — Inference Mental Model',
    blurb: 'KV cache + autoregressive mechanics, in your own code. Prefill vs decode, profiled.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'mini-vllm v0.1 — pure-PyTorch generate with explicit KV cache; profile in notes',
    context:
      'Before you can build a scheduler, you must feel the autoregressive loop in your fingertips. Prefill is parallel and compute-bound. Decode is serial and HBM-bound (HBM = the GPU\'s high-bandwidth memory). The KV cache exists to convert decode from O(N²) to O(N). If you cannot explain that without looking it up, the rest of the sprint is built on sand.',
    weeks: [
      {
        number: 1,
        title: 'Autoregressive + KV cache, in code',
        goal:
          'A from-scratch generate() loop with an explicit KV cache running Llama-3-8B. Prefill vs decode profiled with numbers.',
        tasks: [
          {
            id: 'n-w1-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W1',
            body:
              'Can you do these cold?\n' +
              '  • attention(Q,K,V) + causal masking\n' +
              '  • softmax + temperature + greedy/top-k/nucleus sampling\n' +
              '  • PyTorch forward / no_grad\n' +
              '  • why decode at batch=1 is HBM-bound, not compute-bound\n' +
              'If any feel fuzzy, start the matching resource below alongside the reads — do NOT block the week.',
            verify: 'Quick self-check; any gap-fill resource started (does not need to finish before reads)',
            hours: '15m check + remediation in flight',
            resources: [R.karpathy_zerotohero, R.annotated_transformer, R.kipperly_speed],
          },
          {
            id: 'n-w1-r1',
            track: 'read',
            title: 'PagedAttention paper §1–3',
            body: 'Sections 1–3 only: the memory-management framing. Skip the eval section for now.',
            verify: 'Notes: KV cache size formula (2 · L · H · D · seq_len · dtype_bytes); fragmentation explanation in your own words',
            hours: '1.5h',
            resources: [R.pagedattention],
          },
          {
            id: 'n-w1-r2',
            track: 'read',
            title: 'Horace He — Brrr from First Principles',
            body: 'Compute / memory / overhead — the lens you will use for every benchmark this sprint.',
            verify: 'Notes: for Llama-3-8B fp16 decode at batch=1, predict which regime (compute / HBM / overhead) and justify',
            hours: '1h',
            resources: [R.kipperly_speed],
          },
          {
            id: 'n-w1-r3',
            track: 'read',
            title: 'HF transformers — modeling_llama.py generation path (skim)',
            body:
              'Trace `LlamaForCausalLM.forward` and `generate()`. Identify where the KV cache lives (past_key_values), how it grows, how attention is masked during prefill vs decode.',
            verify: 'Two-paragraph note describing prefill vs decode code paths and where they branch',
            hours: '1.5h',
            resources: [R.hf_generate],
          },
          {
            id: 'n-w1-b1',
            track: 'build',
            title: 'mini-vllm/engine.py — from-scratch generate() with explicit KV cache',
            body:
              'No `model.generate(...)`. Write the autoregressive loop yourself: prefill pass that fills the KV cache, then a decode loop that appends one token + one K/V slice per step. Match HF reference output for greedy decoding on 3 test prompts.',
            verify: 'pytest: greedy output matches HF reference exactly for 3 prompts; KV cache shape grows by 1 per decode step',
            hours: '5h',
            resources: [R.hf_generate],
          },
          {
            id: 'n-w1-b2',
            track: 'build',
            title: 'Profile prefill vs decode — three measurements',
            body:
              'Prompt=512, gen=128. Measure: (a) prefill latency (s), (b) per-decode-step latency (ms), (c) peak HBM. Compare to W0 baseline. Compute arithmetic intensity for prefill and decode and reason about which is HBM-bound.',
            verify: 'mini-vllm/docs/profile.md committed with table + a one-line conclusion per measurement',
            hours: '2h',
            resources: [R.kipperly_speed, R.nsight_compute],
          },
          {
            id: 'n-w1-a1',
            track: 'apply',
            title: 'mini-vllm README + first weekly public post',
            body:
              'A README that is not aspirational. It says: this week I built X, here are the numbers, here is what I learned about the prefill/decode asymmetry, here is what is next. Plain language. No emojis. PUBLISH: paste the same 200 words as a Twitter/X thread + LinkedIn post Friday. This is the first execution of the W0-a4 build-in-public commitment. The thread should hit one specific number (e.g., "decode at batch=1 is ~94% HBM-bound; here is the math") plus a repo link.',
            verify: 'README pushed; Twitter/X thread + LinkedIn post live; both link the repo',
            hours: '1.5h',
          },
          {
            id: 'n-w1-p1',
            track: 'prep',
            title: 'vLLM source — read engine/llm_engine.py top-level loop',
            body:
              'Just read. No PR yet. Build a mental map: where is the scheduler called, where is the model executed, where do KV caches live. Sketch a one-page block diagram.',
            verify: 'mini-vllm/docs/vllm-engine-sketch.md committed with a block diagram (ASCII or PNG)',
            hours: '2h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w1-p2',
            track: 'prep',
            title: 'Leetcode — start daily medium habit',
            body: '30 min/day, 4 days this week. Mediums only. Track in a sheet so streaks compound visibly.',
            verify: '4 mediums logged; one of them solved in <25 min',
            hours: '2h',
            resources: [R.neetcode],
          },
          {
            id: 'n-w1-p3',
            track: 'prep',
            title: 'Math refresh — softmax, temperature, sampling, entropy',
            body:
              'Two hours, paper-and-pen. Derive: (a) softmax(z/T) and what temperature does to the entropy of the distribution, (b) top-k and top-p sampling as restrictions of the softmax, (c) cross-entropy loss vs negative log-likelihood, (d) why argmax = greedy decoding and how nucleus sampling diverges. The mini-vllm generate loop you just wrote uses all four. If you cannot derive them, you do not understand your own code.',
            verify: 'north-portfolio/docs/math-w1.md with the four derivations; cross-check by varying T and top_p in mini-vllm and predicting the entropy change before measuring',
            hours: '2h',
            resources: [R.math4ml_coursera],
          },
        ],
        reading: [R.weng_inference, R.pagedattention, R.hf_generate, R.kipperly_speed],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W2 — Streaming Server + Naive Batching
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-2',
    title: 'Phase 2 — Streaming + Naive Batching',
    blurb: 'First OpenAI-compatible endpoint. SSE streaming. Static batching, on purpose.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.2 — FastAPI /v1/chat/completions with SSE, static batch=N',
    context:
      'Now the artifact starts looking like real serving infra. Token streaming is mandatory for any chat product. Static batching is the wrong long-term answer but the right learning step — you need to feel the head-of-line blocking problem before fixing it with continuous batching next week.',
    weeks: [
      {
        number: 2,
        title: 'OpenAI-compatible streaming server',
        goal:
          'A FastAPI server with /v1/chat/completions that streams tokens via SSE (Server-Sent Events). Static batching across concurrent requests. Two known bugs documented.',
        tasks: [
          {
            id: 'n-w2-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W2',
            body:
              'Can you do these cold?\n' +
              '  • async/await Python + async generators (for StreamingResponse)\n' +
              '  • GPU memory hierarchy basics — HBM / L2 / SMEM, what NCU (NVIDIA Nsight Compute, the GPU profiler) measures\n' +
              'NCU itself is meant to feel partly foggy this week — that is the point. But you need the hierarchy intuition to read the report.',
            verify: 'Quick self-check; if GPU memory hierarchy <3, watch GPU MODE lec 1 before b4',
            hours: '15m check + remediation in flight',
            resources: [R.gpu_mode, R.boehm_matmul, R.fastapi_docs],
          },
          {
            id: 'n-w2-r1',
            track: 'read',
            title: 'OpenAI API reference — streaming chat completions',
            body:
              'Read the streaming event shape precisely. `data: {...}\\n\\n` framing, role in delta on first chunk, finish_reason on last. Test clients break in subtle ways if you get this wrong.',
            verify: 'Notes: SSE event shape with example bytes; finish_reason values listed',
            hours: '1h',
            resources: [R.openai_api_ref],
          },
          {
            id: 'n-w2-r2',
            track: 'read',
            title: 'Anyscale — How continuous batching enables 23x throughput',
            body:
              'Skim now (you implement continuous batching W4). Goal this week: understand WHY static batching wastes throughput so when you build it you feel the pain.',
            verify: 'One-paragraph note: static batching\'s failure mode (head-of-line, generation-length variance)',
            hours: '45m',
            resources: [R.anyscale_batching],
          },
          {
            id: 'n-w2-r3',
            track: 'read',
            title: 'FastAPI docs — async + StreamingResponse',
            body: 'Specifically the SSE patterns. Async generators, backpressure, client-disconnect handling.',
            verify: 'Notes: how StreamingResponse handles client disconnect; one-line summary',
            hours: '45m',
            resources: [R.fastapi_docs],
          },
          {
            id: 'n-w2-b1',
            track: 'build',
            title: 'FastAPI server — /v1/chat/completions, non-streaming first',
            body:
              'Wire the W1 engine behind a single endpoint. Match OpenAI request/response shape exactly. Test with `openai` Python client pointing at your URL.',
            verify: '`openai.chat.completions.create(...)` against your server returns a valid ChatCompletion',
            hours: '3h',
            resources: [R.fastapi_docs, R.openai_api_ref],
          },
          {
            id: 'n-w2-b2',
            track: 'build',
            title: 'Add SSE streaming — stream=True path',
            body:
              'Async generator yielding `data: {json}\\n\\n` chunks. Token-by-token. Handle client disconnect gracefully (cancel generation, free KV cache).',
            verify: '`openai` client with `stream=True` prints tokens incrementally; killing client mid-stream frees KV in your logs',
            hours: '3h',
            resources: [R.fastapi_docs, R.openai_api_ref],
          },
          {
            id: 'n-w2-b3',
            track: 'build',
            title: 'Static batching — collect N requests, run together',
            body:
              'Simple: a request queue + a background coroutine that waits up to T ms or until N requests arrive, then runs them as one batch. Same generation length for all (left-pad inputs). You will hate this by Friday — that is the point.',
            verify: 'At N=4, throughput (tok/s aggregate) ≥ 2.5× single-request; latency for first-arriving request increases by ≤ T ms',
            hours: '3h',
          },
          {
            id: 'n-w2-b4',
            track: 'build',
            title: 'First NCU snapshot — profile the decode forward pass',
            body:
              'One Modal H100 hour (paid). Run `ncu --set roofline --target-processes all python bench_decode.py` on Llama-3-8B at batch=1, seq=512. Capture: arithmetic intensity, HBM throughput, achieved % of peak. You will not understand every metric yet — that is fine. Commit the report. You will reread it after W8 and the numbers will mean something different. The goal here is to make NCU not-scary by W4.',
            verify:
              'mini-vllm/docs/ncu-w2.md committed with the three numbers + one-paragraph "what I think I saw" written without looking it up',
            hours: '2h',
            resources: [R.nsight_compute, R.kipperly_speed, R.modal_docs],
          },
          {
            id: 'n-w2-a1',
            track: 'apply',
            title: 'Demo Loom + weekly public post',
            body:
              '3 minutes max. Show the streaming endpoint. Show 4 concurrent requests. Show your throughput number on screen. Embed link in README. PUBLISH: Friday thread — embed the Loom GIF + "what I learned about head-of-line blocking in static batching" + repo link. The painful-static-batching framing is the hook; you will fix it next week and the W4 post writes itself.',
            verify: 'Loom in README; Twitter/X thread (with Loom embed/GIF) + LinkedIn post live',
            hours: '1.25h',
          },
          {
            id: 'n-w2-a2',
            track: 'apply',
            title: 'mini-vllm/BENCHMARKS.md — first real entry',
            body:
              'Hardware row, dtype row. Three rows for batch=1/4/16 with TTFT, ITL, throughput, peak HBM. Note the static-batching head-of-line issue at the bottom.',
            verify: 'mini-vllm/BENCHMARKS.md committed; numbers reproducible from a single command',
            hours: '1.5h',
          },
          {
            id: 'n-w2-p1',
            track: 'prep',
            title: 'vLLM scheduler — read core/scheduler.py',
            body:
              'Just read. Identify the iteration loop, the running/waiting/swapped queues, and the preemption logic. Compare to your static batcher and write down the three things vLLM does that you do not.',
            verify: 'mini-vllm/docs/vllm-scheduler-notes.md with the three gaps listed',
            hours: '2h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w2-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved this week',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.orca, R.anyscale_batching, R.openai_api_ref, R.fastapi_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W3 — Paged KV Cache
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-3',
    title: 'Phase 3 — Paged KV Cache',
    blurb: 'Implement paged attention\'s memory manager. Understand block tables in your code.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.3 — PagedKVManager with block tables, alloc/free, optional prefix sharing',
    context:
      'PagedAttention\'s contribution is not a kernel — it is a memory manager that treats KV cache like virtual memory. Once the block table exists, prefix sharing, swapping, and OOM-free batching all fall out for free. This is the single most important week of the sprint for the "I understand modern serving" interview signal.',
    weeks: [
      {
        number: 3,
        title: 'Paged KV — block tables and the memory manager',
        goal:
          'A PagedKVManager class with block_size, num_blocks, alloc/free, and a block_table per sequence. Wire it into your engine. No fragmentation, OOM raised cleanly.',
        tasks: [
          {
            id: 'n-w3-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W3',
            body:
              'Can you do these cold?\n' +
              '  • virtual memory + page tables + TLB miss in your own words\n' +
              '  • KV cache size formula + per-step growth (from W1-b1)\n' +
              'PagedAttention is OS virtual memory applied to KV cache. If VM is rusty, do OSTEP below — most prereq-sensitive week of the sprint.',
            verify: 'Quick self-check; OSTEP chs 13-17 read or re-skimmed if VM rating <3',
            hours: '15m check + ~4h OSTEP if needed',
            resources: [R.ostep],
          },
          {
            id: 'n-w3-r1',
            track: 'read',
            title: 'PagedAttention paper — full read this time',
            body: 'Including §4 (block table mechanics) and §5 (eval). The block-table data structure is the artifact you are about to build.',
            verify: 'Notes: block_size tradeoffs; how copy-on-write enables parallel sampling',
            hours: '2h',
            resources: [R.pagedattention],
          },
          {
            id: 'n-w3-r2',
            track: 'read',
            title: 'vLLM — attention/backends + block_manager',
            body:
              'Read `vllm/core/block_manager.py` and one backend (e.g. `attention/backends/flash_attn.py`). Understand the producer/consumer between the manager and the kernel.',
            verify: 'mini-vllm/docs/vllm-block-manager.md sketches the class API + how block_tables are passed to the kernel',
            hours: '2h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w3-b1',
            track: 'build',
            title: 'PagedKVManager class — alloc / free / block_table',
            body:
              'block_size=16 (configurable). A free-list of physical block ids. Per-sequence block_table = list[block_id]. `allocate(seq_id, num_tokens)` extends as needed; `free(seq_id)` returns blocks to the pool.',
            verify: 'Unit tests: random alloc/free pattern over 1000 ops never leaks; OOM raises ValueError cleanly',
            hours: '4h',
          },
          {
            id: 'n-w3-b2',
            track: 'build',
            title: 'Wire PagedKVManager into the engine',
            body:
              'Replace the dense per-sequence KV tensor with a global K/V pool of shape (num_blocks, block_size, num_heads, head_dim). Attention now gathers from blocks via block_table. Use a simple Python gather first; xformers/Flash-Attn paged kernels are W5.',
            verify: 'mini-vllm still matches HF reference output exactly on the 3 W1 test prompts',
            hours: '4h',
          },
          {
            id: 'n-w3-b3',
            track: 'build',
            title: 'Concurrent requests — KV cache no longer OOMs at batch=16',
            body:
              'Before: dense KV per sequence wastes memory proportional to max_seq_len. After: paging means you only consume blocks proportional to actual tokens. Demonstrate this with a memory plot.',
            verify: 'mini-vllm/BENCHMARKS.md updated: peak HBM at batch=16 drops by ≥ 30% vs W2 baseline',
            hours: '2h',
          },
          {
            id: 'n-w3-b4',
            track: 'build',
            title: 'Optional — prefix caching for shared system prompts',
            body:
              'If a request prefix matches an existing block sequence (hash the token ids), reuse those blocks (refcount +1). Free when refcount drops to 0. This is the SGLang RadixAttention idea in its simplest form.',
            verify: 'Test: two requests with the same 200-token system prompt share blocks; second request TTFT drops by ≥ 40%',
            hours: '3h',
            resources: [R.sglang_repo],
          },
          {
            id: 'n-w3-a1',
            track: 'apply',
            title: 'Write-up "Paged KV cache in 400 lines of Python" + weekly public post',
            body:
              'A blog-style README section (or separate post). Show the block_table diagram. Explain why it works. Show the memory plot. Link the code. This is the first artifact a serving-team hiring manager will skim. Make it scannable. PUBLISH: Friday thread — lead with the memory-plot chart ("dense KV at batch=16 OOMs; paged drops peak HBM by ≥30%"). The diagram + chart + repo link is the highest-shareability post of the sprint so far. Cross-post to LinkedIn; consider posting to r/MachineLearning if writeup polish is high.',
            verify: 'mini-vllm/docs/paged-kv-writeup.md ≤ 1500 words; Twitter/X thread + LinkedIn post live; (optional) r/MachineLearning submission link recorded',
            hours: '2.5h',
          },
          {
            id: 'n-w3-p1',
            track: 'prep',
            title: 'OSS scouting — find one realistic vLLM PR',
            body:
              'Browse vLLM "good first issue" + "help wanted". Find one ticket where the scope is real (not "fix typo") but bounded (one file, one test). Comment on it expressing intent. Do not start work yet — you commit W10.',
            verify: 'Comment posted on a single issue; URL saved to north-portfolio/docs/targets.md',
            hours: '1.5h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w3-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved this week',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.pagedattention, R.vllm_repo, R.sglang_repo, R.mosaic_ml_execution],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W4 — Continuous Batching + Scheduler
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-4',
    title: 'Phase 4 — Continuous Batching + Scheduler',
    blurb: 'Iteration-level batching. Chunked prefill. The hot loop that defines modern serving.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.4 — continuous-batching scheduler with prefill/decode mix + chunked prefill',
    context:
      'Continuous batching is the single highest-leverage idea in modern LLM serving. Once you have paged KV + iteration-level scheduling, you have rebuilt the core of vLLM/SGLang/TGI. This week is also when your throughput numbers start being interview-worthy. DENSE WEEK — scheduler build + chunked prefill + token-budget + NCU report sums to ~25h. Expect to invoke the Wednesday-drop rule and ship Leetcode + one prep task to W5. The build+apply spine is non-negotiable; everything else can slip.',
    weeks: [
      {
        number: 4,
        title: 'Continuous batching + chunked prefill',
        goal:
          'A scheduler that admits requests at every iteration, mixes prefill and decode in one step, and chunks long prefills. Throughput chart that beats W2 static batching by ≥ 3×.',
        tasks: [
          {
            id: 'n-w4-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W4',
            body:
              'Can you do these cold?\n' +
              '  • roofline + arithmetic intensity — predict regime from shape+dtype+hardware\n' +
              '  • iteration-level vs request-level scheduling (Orca r1 covers it; skim §1 first if scheduling theory feels alien)\n' +
              '  • static-batching failure modes — head-of-line, gen-length variance (should be vivid from W2-a1)',
            verify: 'Quick self-check; roofline remediation started before r1 if rating <3',
            hours: '15m check + remediation in flight',
            resources: [R.kipperly_speed, R.williams_roofline, R.orca],
          },
          {
            id: 'n-w4-r1',
            track: 'read',
            title: 'Orca paper §1–3',
            body: 'The iteration-level scheduling idea, in its original form. Required.',
            verify: 'Notes: iteration-level vs request-level scheduling, one paragraph each, contrasted',
            hours: '1.5h',
            resources: [R.orca],
          },
          {
            id: 'n-w4-r2',
            track: 'read',
            title: 'Sarathi-Serve paper',
            body:
              'Chunked prefill — why mixing prefill chunks into decode batches keeps GPU utilization high without bloating decode latency.',
            verify: 'Notes: chunked-prefill tradeoffs; pick a chunk_size and justify it',
            hours: '1.5h',
            resources: [R.sarathi_serve],
          },
          {
            id: 'n-w4-r3',
            track: 'read',
            title: 'vLLM v1 engine RFC + SGLang scheduler blog',
            body:
              'Read both. Two different scheduler designs solving the same problem. You will internalize the tradeoffs better by seeing both than by reading either alone.',
            verify: 'mini-vllm/docs/scheduler-comparison.md with a 3-row table (vLLM v0 / vLLM v1 / SGLang) on scheduling policy',
            hours: '2h',
            resources: [R.vllm_repo, R.sglang_repo],
          },
          {
            id: 'n-w4-b1',
            track: 'build',
            title: 'Scheduler — iteration-level admission',
            body:
              'Replace W2 static batcher. At every model step: (1) admit waiting requests up to budget, (2) decode current running set, (3) free completed requests, (4) yield streams. Single GIL-friendly Python loop is fine — no asyncio gymnastics.',
            verify: 'Throughput at 32 concurrent variable-length requests ≥ 3× W2 static-batching baseline',
            hours: '5h',
          },
          {
            id: 'n-w4-b2',
            track: 'build',
            title: 'Chunked prefill — split long prompts across iterations',
            body:
              'If a waiting request has prompt > chunk_size, schedule chunk_size of its prefill alongside running decodes. Tune chunk_size for your hardware (start 512).',
            verify: 'P99 ITL for decode-only requests does NOT degrade when a long-prompt request enters; chart in mini-vllm/BENCHMARKS.md',
            hours: '3h',
            resources: [R.sarathi_serve],
          },
          {
            id: 'n-w4-b3',
            track: 'build',
            title: 'Token budget per iteration — soft cap',
            body:
              'Set a per-iteration token budget (e.g., 8192). Scheduler must fit running decodes + new prefill chunks under this cap. Avoids OOM and stabilizes latency.',
            verify: 'OOM-free at 64 concurrent long-context requests; budget hit rate logged',
            hours: '2h',
          },
          {
            id: 'n-w4-b4',
            track: 'build',
            title: 'NCU profile of the scheduler iteration — the headline number',
            body:
              'Second paid Modal H100 hour. `ncu --set full` on one iteration of the continuous-batching loop at concurrency=32. Capture: kernel breakdown (which kernels dominate ms), HBM throughput, achieved TC % (Tensor Core utilization) on the matmuls. Compare against the W2 baseline. This is the report you screenshot for the BENCHMARKS chart and walk recruiters through in the SD (system-design) interview.',
            verify:
              'mini-vllm/docs/ncu-w4.md committed with kernel-time pie chart, HBM throughput, achieved-TC % vs W2; one-paragraph "what changed and why"',
            hours: '2.5h',
            resources: [R.nsight_compute, R.kipperly_speed, R.modal_docs],
          },
          {
            id: 'n-w4-a1',
            track: 'apply',
            title: 'BENCHMARKS headline chart + weekly public post',
            body:
              'Throughput vs concurrency curve, batch=1..64. Three lines: W2 static, W3 paged-no-CB, W4 continuous-batching. The shape of these lines IS your interview pitch — practice describing it out loud. PUBLISH: Friday thread — the chart is the post. Caption: "rebuilt vLLM\'s scheduler in 600 LOC of Python; here is the 3× throughput jump from continuous batching." Link the repo. This is the post most likely to surface in inference-infra circles and get a recruiter DM.',
            verify: 'Chart committed (PNG + the python script that generates it); narrative paragraph below; Twitter/X thread + LinkedIn post live with chart embedded',
            hours: '2.5h',
          },
          {
            id: 'n-w4-a2',
            track: 'apply',
            title: 'Outreach round 1 — 5 referrer-target DMs',
            body:
              'Pick 5 people from your target-company list who work in inference/serving. Short DM: "I am building a vLLM-style engine to learn the lane, here is the BENCHMARKS chart, can I ask one specific question about your team\'s scheduler?" The chart is what earns the reply.',
            verify: '5 DMs sent; replies tracked in north-portfolio/docs/outreach.md',
            hours: '1.5h',
          },
          {
            id: 'n-w4-p1',
            track: 'prep',
            title: 'System-design page 1 — "Design an LLM inference service"',
            body:
              'Fill the empty W0 page. Constraints (1k QPS, p99 TTFT, p99 ITL, cost ceiling). Components (LB → scheduler → model worker → KV manager). Bottlenecks. Failure modes. Practice presenting in 25 min.',
            verify: 'Page filled; 25-min self-presentation rehearsed and timed',
            hours: '2.5h',
            resources: [R.huyen_ml_interview],
          },
          {
            id: 'n-w4-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums (DROP if behind on Wed)',
            body:
              'Lowered priority post-2026-05-25 revision. Inference-engineer loops are systems-design + kernels, not arrays-and-strings. Drop this entire bucket if any spine task is at risk.',
            verify: '4 mediums solved — only if read+build+apply spine is on track',
            hours: '2h',
            resources: [R.neetcode],
          },
          {
            id: 'n-w4-a3',
            track: 'apply',
            title: 'Anthropic Fellows Program — application started (parallel track)',
            body:
              'The asymmetric hedge. Remote, no-PhD, no-prior-ML required, $3,850/week stipend + ~$15K/month compute, ~40% FTE conversion. The 2026 Fellows cycle pages are at alignment.anthropic.com — check open dates. Pitch ONE concrete project, 1 page max:\n' +
              '  (a) preferred angle: RL post-training infrastructure project (rollout engine, async RL, verifier scaling) — leverages your inference work directly;\n' +
              '  (b) alternate: mechanistic interpretability scaling project — Neel Nanda\'s prereq syllabus is the entry path.\n' +
              'Frame your mini-vLLM + scheduler work as the credibility evidence. The W4 BENCHMARKS chart you just shipped is the artifact to link. Worst case: rejected, North proceeds. Best case: you skip the entire job funnel.',
            verify: 'Application draft 1 written; one Anthropic Fellows alum DM\'d for review; submit by W6.',
            hours: '2h',
          },
        ],
        reading: [R.orca, R.sarathi_serve, R.vllm_repo, R.sglang_repo],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W5 — Quantization OR Speculative Decoding (pick one)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-5',
    title: 'Phase 5 — Inference Accelerator',
    blurb: 'Pick one: quantization (INT8/INT4) or speculative decoding. Ship it with numbers.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.5 — INT8 weight-only quant OR speculative decoding with a draft model',
    context:
      'Do not try both. A shipped quant story with a memory plot and a quality eval beats half-built quant + half-built specdec every time. Quant is the safer bet for hiring signal (universal in production); spec-decoding is sexier but trickier to integrate cleanly. Choose by Monday.',
    weeks: [
      {
        number: 5,
        title: 'One accelerator, shipped',
        goal:
          'Either INT8 weight-only with bitsandbytes/torchao, OR speculative decoding with a small draft model. Memory + throughput + quality numbers committed.',
        tasks: [
          {
            id: 'n-w5-r1',
            track: 'read',
            title: 'AWQ + GPTQ overview',
            body:
              'Read AWQ §1-3 and the GPTQ overview (AWQ and GPTQ are the two dominant post-training weight-quantization methods). Goal: understand calibration sets, group sizes, the accuracy/throughput tradeoff. You probably will not implement either from scratch — you will use a library — but you must reason about which to pick.',
            verify: 'Notes: AWQ vs GPTQ decision tree (when to use which)',
            hours: '1.5h',
            resources: [R.awq, R.gptq],
          },
          {
            id: 'n-w5-r2',
            track: 'read',
            title: 'Speculative decoding — Leviathan + Medusa',
            body:
              'Even if you pick the quant track, read these. The verification trick (draft proposes N tokens, target verifies in one forward pass) is a classic systems-meets-ML idea.',
            verify: 'One-paragraph note: why specdec is free for memory-bound decode but not for compute-bound prefill',
            hours: '1.5h',
            resources: [R.leviathan_spec, R.medusa, R.eagle],
          },
          {
            id: 'n-w5-b1',
            track: 'build',
            title: 'Decide: quant OR specdec. Commit Monday.',
            body:
              'Write a 200-word decision doc. Stop second-guessing after Monday. The hire signal is "shipped one well" not "started two".',
            verify: 'mini-vllm/docs/w5-decision.md committed Monday EOD',
            hours: '1h',
          },
          {
            id: 'n-w5-b2',
            track: 'build',
            title: 'Quant track — INT8 weight-only with bitsandbytes or torchao',
            body:
              'Load Llama-3-8B with int8 weights. Activations stay fp16/bf16. Verify it integrates with your paged KV + continuous batcher (it should — only the linear layers change).',
            verify:
              'Quant model boots; greedy output matches fp16 on the 3 W1 prompts within edit-distance 5; peak HBM drops ≥ 35%',
            hours: '4h',
            resources: [R.awq, R.gptq],
          },
          {
            id: 'n-w5-b3',
            track: 'build',
            title: 'Specdec track — small draft model + verification step',
            body:
              'Llama-3-8B target, TinyLlama or Llama-3-8B-distilled as draft. Draft proposes K=4 tokens, target verifies in one forward, accept up to first rejection. The acceptance loop is ~100 lines once your engine supports two model handles.',
            verify:
              'Greedy output identical to non-specdec at temperature 0; observed tokens/sec increase by ≥ 1.5× at batch=1',
            hours: '5h',
            resources: [R.leviathan_spec, R.medusa],
          },
          {
            id: 'n-w5-b4',
            track: 'build',
            title: 'Quality eval — MT-Bench (multi-turn LLM quality benchmark) subset or in-house golden set',
            body:
              'Pick 30 prompts. Run pre- and post-acceleration. Score with a judge model (GPT-4o or Claude). Quant should be ≤ 1% degradation; specdec at T=0 should be identical.',
            verify: 'mini-vllm/docs/quality-eval.md with per-prompt scores and aggregate delta',
            hours: '2h',
          },
          {
            id: 'n-w5-a1',
            track: 'apply',
            title: 'mini-vllm/BENCHMARKS.md — the accelerator section',
            body:
              'Before/after table: throughput, peak HBM, p99 ITL, quality delta. The quality column is the one that makes this credible — without it, recruiters assume you broke the model.',
            verify: 'Four-column section pushed; numbers reproducible',
            hours: '1.5h',
          },
          {
            id: 'n-w5-a2',
            track: 'apply',
            title: 'mini-vllm v0.5 release — tag + changelog + weekly post',
            body:
              'Git tag v0.5. CHANGELOG entry. Update repo description ("OpenAI-compatible LLM serving engine with paged KV + continuous batching + INT8/specdec — built to learn the lane"). This is the version you start linking from applications. PUBLISH: Friday thread — release-style post. The four-column accelerator table (throughput / HBM / p99 ITL / quality delta) is the body. "5 weeks ago this was a from-scratch generate() loop; today it ships INT8 quant with <1% quality drop." Pin this thread on your profile — it is the headline artifact recruiters will see when they click through.',
            verify: 'v0.5 tag on GitHub; repo description updated; release-style Twitter/X thread (pinned) + LinkedIn post live',
            hours: '1.25h',
          },
          {
            id: 'n-w5-p1',
            track: 'prep',
            title: 'Behavioral STAR stories — draft 6',
            body:
              'Six 90-second stories: ambiguity, conflict, failure, scope-cut, perf-win, mentorship. From your existing 6yr SWE career, not from this sprint. Practice out loud once each.',
            verify: 'north-portfolio/docs/behavioral.md with six STAR-shaped entries',
            hours: '2h',
          },
          {
            id: 'n-w5-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.awq, R.leviathan_spec, R.medusa, R.eagle],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W6 — AI Gateway Part 1 (skeleton + routing + fallback + cost)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-6',
    title: 'Phase 6 — OSS PR push (primary) + ai-gateway (optional)',
    blurb: 'PRIMARY DELIVERABLE: a vLLM or SGLang design-comment-acked PR open by Friday. ai-gateway lives this week only if W5 finished clean.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'A design-comment-acked PR open in vLLM or SGLang by Friday EOD — THE W6 deliverable. ai-gateway v0.1 only if time permits after the PR is open.',
    context:
      '⚠ REVISED 2026-05-25. The original plan had ai-gateway as the W6 flagship; deep research convergence + a re-read of your own oss-contribution-playbook ("a landed merge PR beats a half-built clone") demanded inversion. The single highest-leverage artifact this week is a design comment with maintainer ack on a real vLLM / SGLang issue. mini-vllm exists to give you codebase fluency; the *contribution* is what hiring managers click on. ai-gateway is demoted to OPTIONAL — keep it as a portfolio side-bullet, not a flagship. The week\'s shape: 1) finish the OSS scouting list from W3, pick ONE issue with a recently-active maintainer; 2) write a 200-400 word design comment per the playbook; 3) wait for ack while implementing; 4) only AFTER the PR is open, spend remaining time on a minimal ai-gateway skeleton.',
    weeks: [
      {
        number: 6,
        title: 'Open the vLLM/SGLang PR — then maybe ai-gateway',
        goal:
          'PRIMARY: a design-comment with maintainer ack on a real vLLM or SGLang issue by Friday EOD; implementation in flight; PR open. SECONDARY: ai-gateway v0.1 skeleton if time remains.',
        tasks: [
          {
            id: 'n-w6-oss1',
            track: 'apply',
            title: 'OSS PR step 1: codebase tour + issue selection (per the playbook)',
            body:
              'Re-read /applied/inference-internals/oss-contribution-playbook (your own work). Pick ONE project: vLLM is highest visibility but slowest review (1-3w); SGLang is faster review (3-10d) and smaller maintainer team. Then pick ONE issue with three filters: (a) the tagging maintainer reviewed PRs in the last 7 days, (b) scope <200 LOC realistic, (c) you can write a 1-paragraph design before coding. Aim for new-model-architecture, sampling-param exposure, or scheduler-policy tweaks — these are the playbook\'s "lands easily" zones.',
            verify: 'north-portfolio/docs/oss-pr-selection.md: project chosen, issue link, maintainer activity proof (PRs in last 7d), 3-filter scoring sheet',
            hours: '2h',
            resources: [R.vllm_repo, R.sglang_repo],
          },
          {
            id: 'n-w6-oss2',
            track: 'apply',
            title: 'OSS PR step 2: write the design comment',
            body:
              '200-400 words. What you propose, scope estimate, test plan, benchmark methodology, links to relevant existing files. Post on the issue. The design comment is the artifact maintainers triage on — and the cheapest signal to them that you\'ve read the code. Wait for ack before writing implementation code. Use ack-wait time on n-w6-oss3 implementation skeleton, OR on ai-gateway if PR scope is small.',
            verify: 'Design comment posted on the issue thread; URL committed to north-portfolio/docs/oss-pr-selection.md',
            hours: '2h',
          },
          {
            id: 'n-w6-oss3',
            track: 'build',
            title: 'OSS PR step 3: implementation in branch (after ack)',
            body:
              'Once maintainer acks the design: implement on a feature branch in your fork. Match the project\'s existing conventions exactly (lint, naming, tests). Benchmarks for any perf claim. Open the PR by Friday EOD even if not yet merge-ready; the *open* PR is the W6 deliverable. Subsequent review iterations land in W7-W8.',
            verify: 'PR opened against vllm-project/vllm or sgl-project/sglang. URL in north-portfolio/docs/oss-pr-selection.md.',
            hours: '6-10h',
          },
          {
            id: 'n-w6-r1',
            track: 'read',
            title: 'LiteLLM Router — read the source (only if PR opened by Wed)',
            body:
              'Specifically `litellm/router.py`. Understand the routing strategies (least-busy, weighted, latency-based), the cooldown logic, the fallback chain.',
            verify: 'ai-gateway/docs/litellm-router-notes.md with the four routing strategies summarized',
            hours: '2h',
            resources: [R.litellm_repo],
          },
          {
            id: 'n-w6-r2',
            track: 'read',
            title: 'Portkey + Cloudflare AI Gateway docs',
            body: 'Two commercial reference architectures. Steal the features list and split it into "this week" vs "next week" vs "skip."',
            verify: 'ai-gateway/docs/gateway-features.md with each feature tagged W6 / W7 / skip',
            hours: '1h',
            resources: [R.portkey_gateway, R.cf_ai_gateway],
          },
          {
            id: 'n-w6-b1',
            track: 'build',
            title: 'ai-gateway skeleton — OPTIONAL, only if OSS PR is open by Wed',
            body:
              'Demoted from W6 spine to optional after 2026-05-25 revision. Build only if the OSS PR is design-comment-acked and in progress by Wednesday. Single endpoint /v1/chat/completions. Provider abstraction with three impls: OpenAI, Anthropic, local-vllm (your W5). Config-driven model list. Streaming pass-through. Otherwise — skip. The OSS PR is the lane signal; ai-gateway is decoration.',
            verify:
              'OPTIONAL: same request hits all three providers via `model=` switch. Skip entirely if PR work is behind.',
            hours: '0-4h (depends on PR progress)',
          },
          {
            id: 'n-w6-b2',
            track: 'build',
            title: 'Routing + fallback + retry',
            body:
              'Strategy: cost-aware primary + capability-fallback. Retry on 429/5xx with exponential backoff. Fallback chain on persistent failure. Cooldown a provider for N seconds after error rate threshold.',
            verify: 'Chaos test: kill OpenAI mock midstream → request resolves via Anthropic within 2 retries; structured log shows the path',
            hours: '5h',
          },
          {
            id: 'n-w6-b3',
            track: 'build',
            title: 'Cost ledger — per-request input/output cost, SQLite',
            body:
              'Per-request: input tokens × input price + output tokens × output price → cost. Append to a SQLite ledger (Postgres later). `/admin/costs?since=...` returns aggregate cost grouped by model + by API key.',
            verify: '`/admin/costs` endpoint returns correct aggregates against a fixture set of 100 requests',
            hours: '3h',
          },
          {
            id: 'n-w6-a1',
            track: 'apply',
            title: 'ai-gateway README v0.1 — what it does today, what is coming next week',
            body:
              'Architecture diagram (Excalidraw or Mermaid). Numbers table: fallback success rate during chaos test, p50/p99 added latency vs direct provider call. Explicit "next week" section listing cache / OTel (OpenTelemetry) / rate-limit / RAG side-quest. The "honest in-progress" framing reads well to engineering hiring managers.',
            verify: 'README pushed; diagram embedded; W7 roadmap section visible',
            hours: '1.5h',
          },
          {
            id: 'n-w6-a2',
            track: 'apply',
            title: 'Weekly public post — gateway part 1',
            body:
              'Your second public post under the W0 build-in-public commitment. Short. The gateway diagram. The fallback chaos-test number. Link to repo. This is what travels.',
            verify: 'Twitter/X + LinkedIn post pushed; link added to portfolio meta-repo',
            hours: '45m',
          },
          {
            id: 'n-w6-p1',
            track: 'prep',
            title: 'System-design page 2 — "Design an AI Gateway"',
            body:
              'Fill the empty W0 page. Use ai-gateway as the body. Constraints (10k RPS, multi-tenant, p99 added latency < 50ms). Cache invalidation strategy. Multi-region deploy. You will rehearse this after W7 when you have all the parts shipped.',
            verify: 'Page filled to first-draft level; concrete numbers from your service inserted in placeholder slots',
            hours: '2h',
          },
          {
            id: 'n-w6-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.litellm_repo, R.portkey_gateway, R.cf_ai_gateway],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W7 — AI Gateway Part 2 (cache + OTel + rate limit) + 2-day RAG side-quest
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-7',
    title: 'Phase 7 — AI Gateway · Part 2 + Applied AI side-quest',
    blurb: 'Project 2, week 2 of 2. Cache + OTel + rate limit. Then 2-day mini-RAG demo for breadth.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact:
      'ai-gateway v1.0 — full platform layer (cache, OTel, rate limit) + mini-rag-demo (single repo, hybrid retrieval, ≤500 LOC) as Applied-AI side-quest',
    context:
      'The original plan had RAG as a flagship; that diluted the inference-engineer lane. RAG is now a 2-day side-quest at the end of this week — enough to show breadth on a resume bullet ("built a hybrid-retrieval demo with eval harness"), not enough to claim it as a flagship. The week\'s spine is finishing the gateway so it is genuinely the "platform layer" artifact you can walk a hiring manager through. DENSE WEEK — gateway hardening (cache + OTel + rate limit + load test) plus the RAG side-quest sums to ~26h. The RAG side-quest is the explicit drop candidate: if you are behind on Wednesday, ship a 2-row eval table and 100 lines of code, NOT a polished demo. Gateway v1.0 is non-negotiable; RAG is "nice to have."',
    weeks: [
      {
        number: 7,
        title: 'Gateway hardening + RAG side-quest',
        goal:
          'ai-gateway v1.0: semantic cache, OTel/Jaeger traces, per-key rate limiting, load test under 100 RPS. Plus: a 2-day mini-RAG demo with hybrid retrieval and a 20-Q eval set, lives in a small companion repo, NOT on the flagship list.',
        tasks: [
          {
            id: 'n-w7-r1',
            track: 'read',
            title: 'OpenTelemetry Python — traces + metrics',
            body:
              'Just enough to instrument route handlers with spans and counters. You will export to a local Jaeger. Read the trace-context-propagation section twice — async + middleware boundaries are where most people lose spans.',
            verify: 'Notes: trace context propagation across async calls; one paragraph on the three failure modes',
            hours: '1h',
            resources: [R.otel_docs],
          },
          {
            id: 'n-w7-r2',
            track: 'read',
            title: 'Cache strategies + RAG mini-read',
            body:
              'For the gateway: read one source on semantic cache invalidation (Portkey blog or a vendor write-up). For the RAG side-quest: Pinecone "RAG that actually works" (skim, 30m). Ragas docs (skim, 20m). You are not building a flagship RAG; you are building a demo that has the right vocabulary.',
            verify: 'Notes: cache invalidation tradeoffs + the four ragas metrics in one sentence each',
            hours: '1.5h',
            resources: [R.portkey_gateway, R.pinecone_rag, R.ragas_docs],
          },
          {
            id: 'n-w7-b1',
            track: 'build',
            title: 'Semantic cache — embed prompt, cosine match against Redis',
            body:
              'Embed request prompt with a tiny embedding model (e5-small or bge-small). Cosine-search against a Redis-backed cache. Return cached completion if similarity > τ. Configurable per-route. Skip caching for streaming responses in v1.',
            verify: 'Hit rate ≥ 30% on a repeated FAQ workload; cached response served < 50ms; cache invalidation rule documented',
            hours: '3h',
          },
          {
            id: 'n-w7-b2',
            track: 'build',
            title: 'OTel traces + Jaeger local',
            body:
              'Emit OTel spans with provider, latency, tokens, cost as attributes. Local Jaeger via docker-compose. Spans must propagate across async boundaries — verify with a request that fans out to retry + fallback and shows the full tree.',
            verify: 'Jaeger UI shows traces with provider/latency/cost attributes; one screenshot in README',
            hours: '3h',
            resources: [R.otel_docs],
          },
          {
            id: 'n-w7-b3',
            track: 'build',
            title: 'Rate limiting — token-bucket per API key',
            body: 'Per-key RPM + TPM (requests-per-minute + tokens-per-minute) limits. Return 429 with Retry-After header. Test under load with a small load-test script (locust or hey).',
            verify: 'Under 2× limit traffic, exactly the over-limit fraction gets 429; under limit, 0% rejection',
            hours: '2h',
          },
          {
            id: 'n-w7-b4',
            track: 'build',
            title: 'Load test — 100 RPS mixed workload',
            body:
              'Synthetic 100-RPS mix (80% short, 20% long) for ~10 min. Capture: p50/p95/p99 latency, cache hit rate, fallback rate. Two ways: (a) PAID — one Modal H100 hour with your mini-vllm as one backend, proves end-to-end; (b) FREE — locally against mocked OpenAI/Anthropic responders, proves the gateway logic without the GPU loop. Either works for the hire signal. Use (a) only if you have Modal budget left; else (b).',
            verify: 'ai-gateway/docs/BENCHMARKS-gateway.md committed (in the ai-gateway repo) with the three latency percentiles, hit/fallback rates, mode used (paid/free), and a one-paragraph honest assessment',
            hours: '2.5h',
            resources: [R.modal_docs],
          },
          {
            id: 'n-w7-b5',
            track: 'build',
            title: 'mini-rag-demo (Applied-AI side-quest, capped at 2 days)',
            body:
              'Companion repo, NOT flagship. Single file ≤500 LOC. 20-Q gold set on a corpus you care about (Mosaic content, K8s docs, whatever). BM25 + dense retrieval, RRF (reciprocal rank fusion) fuse, bge-reranker, top-3 chunks to your gateway. Compute precision@3 + ragas faithfulness on the 20 questions. The point: a resume bullet that says "hybrid retrieval, cross-encoder rerank, eval harness" — backed by a tiny working repo. Do NOT spend more than 2 days here. If it slips, ship what you have.',
            verify:
              'mini-rag-demo repo public; README ≤ 400 words; eval table with 2 rows (BM25 only / hybrid+rerank) and both metrics; total time spent ≤ 2 days (track it)',
            hours: '6h',
            resources: [R.pinecone_rag, R.ragas_docs, R.bge_reranker],
          },
          {
            id: 'n-w7-a1',
            track: 'apply',
            title: 'ai-gateway v1.0 release + weekly public post',
            body:
              'Git tag v1.0. README now lists every feature the live service has, with one number for each. Public post: gateway architecture, Jaeger screenshot, load-test numbers. Same template as W6 post.',
            verify: 'v1.0 tag exists; README full; Twitter/X + LinkedIn post pushed',
            hours: '1h',
          },
          {
            id: 'n-w7-a2',
            track: 'apply',
            title: 'Applications — first 5',
            body:
              'Five real applications this week. Tailored cover note (3 sentences) referencing one specific thing the team works on. Link mini-vllm + ai-gateway. Mention mini-rag-demo as a one-line "also" — never the headline.',
            verify: '5 applications submitted; north-portfolio/docs/applications.md tracker started (umbrella repo)',
            hours: '2h',
          },
          {
            id: 'n-w7-p1',
            track: 'prep',
            title: 'System-design page 3 — "Design a Multi-Tenant AI Platform"',
            body:
              'Replaces the original "Design Production RAG" page — that no longer matches your portfolio. New page: multi-tenant safety (auth, quota, isolation, prompt-injection budget), cost attribution, observability. Constraints (1000 tenants, 10k RPS aggregate, p99 added latency < 50ms, per-tenant cost ledger). Your gateway is the body of the answer.',
            verify: 'Page filled; rehearsed in 25 min',
            hours: '2.5h',
          },
          {
            id: 'n-w7-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.otel_docs, R.portkey_gateway, R.pinecone_rag, R.ragas_docs, R.bge_reranker],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W8 — GPU / Runtime Intuition
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-8',
    title: 'Phase 8 — GPU Intuition',
    blurb: 'Enough GPU depth to interview credibly. Read FlashAttention. Write one Triton kernel.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-compilers)',
    artifact: 'kernels/ directory in mini-vllm — Triton softmax + matmul-bias with roofline analysis',
    context:
      'GPU intuition was threaded through W2 (first NCU snapshot of the decode pass) and W4 (NCU profile of the continuous-batching iteration). This week consolidates: you write your own kernels. For the AI Systems Engineer lane (not the dedicated kernel engineer lane), one well-understood Triton kernel + a roofline reading habit is enough. You are not competing with CUTLASS authors. You are demonstrating that you can read a kernel, predict its regime, and verify with NCU. The W2/W4 reports are now reread with the depth this week buys you — and the numbers mean something different. DENSE WEEK — kernel writing + autotune + NCU + roofline writeup sums to ~22h. The roofline writeup is the drop candidate if you slip; the two kernels + NCU report are non-negotiable (they are the W8 artifact).',
    weeks: [
      {
        number: 8,
        title: 'Triton kernel + roofline reading',
        goal:
          'A Triton softmax and a Triton matmul-bias kernel within 70% of torch reference. One NCU report committed showing TC utilization on the matmul. One roofline writeup.',
        tasks: [
          {
            id: 'n-w8-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W8',
            body:
              'Can you do these cold?\n' +
              '  • H100 bandwidth pyramid (HBM3 ≈ 3.35 TB/s, L2 ≈ 50 MB, SMEM ≈ 228 KB/SM, regs ≈ 65k/SM)\n' +
              '  • roofline reflex — the arithmetic-intensity calculation you do in a1\n' +
              '  • Tensor Core shape constraints (wgmma, the Hopper warpgroup matmul instruction; when matmul falls back to CUDA cores)\n' +
              'Dense week — gap-fills before the kernel builds save days mid-week.',
            verify: 'Quick self-check; remediation started if any reflex rating <3',
            hours: '15m check + remediation in flight',
            resources: [R.hopper_whitepaper, R.boehm_matmul, R.kipperly_speed, R.hopper_tuning_guide],
          },
          {
            id: 'n-w8-r1',
            track: 'read',
            title: 'FlashAttention-2 paper §3',
            body:
              'Tiling + IO-aware attention. You will not implement FA2 — you will use it as the canonical example of an IO-aware kernel for your roofline writeup.',
            verify: 'Notes: why FA2 is faster than naive attention despite doing strictly more FLOPs',
            hours: '2h',
            resources: [R.flashattention2],
          },
          {
            id: 'n-w8-r2',
            track: 'read',
            title: 'GPU MODE lectures 1 + 2',
            body: 'Memory hierarchy mapped to ML workloads. The bandwidth pyramid. Watch with notes open.',
            verify: 'Sketch of the H100 bandwidth pyramid with numbers (HBM3, L2, SMEM, registers) committed',
            hours: '2h',
            resources: [R.gpu_mode],
          },
          {
            id: 'n-w8-r3',
            track: 'read',
            title: 'Triton tutorials — vector add → softmax → matmul',
            body: 'Three tutorials, in order. Type the code, do not paste. Goal: build the muscle for tile sizes, BLOCK constants, and program_id math.',
            verify: 'All three tutorials run on your GPU; matmul within 80% of cuBLAS',
            hours: '3h',
            resources: [R.triton_docs],
          },
          {
            id: 'n-w8-b1',
            track: 'build',
            title: 'kernels/softmax_triton.py',
            body: 'Fused softmax along the last axis. Numerically stable (subtract max). Use shared memory via the tl.load/store tile API.',
            verify: 'matches torch.softmax to 1e-5 atol; within 80% of torch on M×N where N=2048',
            hours: '3h',
            resources: [R.triton_docs],
          },
          {
            id: 'n-w8-b2',
            track: 'build',
            title: 'kernels/matmul_bias_triton.py',
            body:
              'fp16 matmul with fused bias add. Tune BLOCK_M/N/K. Use the tutorial autotune. Verify against torch.matmul + bias.',
            verify: 'Matches torch within 1e-3 rtol; achieves ≥ 70% of cuBLAS+bias on (M, N, K) = (4096, 4096, 4096)',
            hours: '4h',
            resources: [R.triton_docs],
          },
          {
            id: 'n-w8-b3',
            track: 'build',
            title: 'NCU profile of the matmul — TC utilization check',
            body:
              'Run `ncu --set full python kernels/bench_matmul.py`. Find the SM__pipe_tensor_op metric. Verify Tensor Cores are actually engaged (not falling back to CUDA cores).',
            verify: 'mini-vllm/docs/ncu-report.md committed with the TC % number and a one-paragraph interpretation',
            hours: '2h',
            resources: [R.nsight_compute],
          },
          {
            id: 'n-w8-a1',
            track: 'apply',
            title: 'Writeup — "Roofline for an inference kernel author"',
            body:
              'Short post. The H100 ridge point ≈ arithmetic intensity (AI) of 295 FLOPs/byte (fp16). Show: your matmul\'s observed AI, the regime it sits in, the gap from peak, and what you would tune next. One diagram. This is the writeup that gets re-shared.',
            verify: 'mini-vllm/docs/roofline-writeup.md ≤ 1200 words; one chart',
            hours: '2h',
            resources: [R.kipperly_speed, R.flashattention2],
          },
          {
            id: 'n-w8-a2',
            track: 'apply',
            title: 'Applications — 5 more',
            body: 'Tailored as before. Now you can mention "wrote my own Triton matmul" in the cover note for serving-infra companies.',
            verify: '5 applications submitted',
            hours: '2h',
          },
          {
            id: 'n-w8-p1',
            track: 'prep',
            title: 'Mock interview slot — book one',
            body:
              'Use Pramp, interviewing.io, or a peer. Book one slot in W11. Yes, four weeks out. It will arrive faster than you expect.',
            verify: 'Mock interview booked; calendar invite saved',
            hours: '30m',
          },
          {
            id: 'n-w8-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.flashattention2, R.flashattention3, R.gpu_mode, R.triton_docs, R.nsight_compute, R.mosaic_compilers],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W9 — Distributed Inference
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-9',
    title: 'Phase 9 — Distributed Inference',
    blurb: 'Project 4. Multi-worker replica serving OR 2-GPU tensor parallelism. Scaling bench.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'dist-inference — replica router with consistent hashing + queue, OR 2-GPU TP for a small model',
    context:
      'Pick replica-serving if you have 1 GPU (cheap to demonstrate via process-level replicas). Pick TP if you have 2 GPUs (more impressive, harder to debug). Kaggle gives you 2× T4 for free (30h/wk) which makes the TP track meaningfully more accessible than this plan originally assumed — strongly prefer TP for the hire signal unless you are already behind on the sprint. Either way: the artifact is a scaling chart, not the parallelism itself. DENSE WEEK — after picking ONE track (replica or TP, NOT both), the load is ~22h. If you try to do both you will ship neither. The scaling chart + README is non-negotiable; SD page 4 can slip to W10 if needed.',
    weeks: [
      {
        number: 9,
        title: 'Multi-worker serving with a scaling chart',
        goal:
          'Either: a replica router with consistent hashing + per-replica queue + health checks, OR a 2-GPU TP implementation for a small model. Scaling chart in dist-inference/BENCHMARKS.md.',
        tasks: [
          {
            id: 'n-w9-prereq',
            track: 'prep',
            title: 'Prerequisites — verify before W9',
            body:
              'Can you do these cold?\n' +
              '  • NCCL collectives — all-reduce (ring vs tree), all-gather, reduce-scatter\n' +
              '  • tensor parallel for attention + MLP (Megatron row/column split — r1 covers it)',
            verify: 'Quick self-check; NCCL remediation done if rating <3',
            hours: '15m check + remediation in flight',
            resources: [R.weng_train_large, R.nccl_docs, R.megatron_tp],
          },
          {
            id: 'n-w9-r1',
            track: 'read',
            title: 'Pope et al — Efficiently Scaling Transformer Inference',
            body:
              'Google\'s analytical framework. The cost-per-token math is exactly what you would draw on a whiteboard in an inference-infra system-design interview.',
            verify: 'Notes: communication cost vs compute cost as model/batch grows, in one paragraph',
            hours: '2h',
            resources: [R.pope_efficient],
          },
          {
            id: 'n-w9-r2',
            track: 'read',
            title: 'Megatron-LM TP paper §2-3 + Weng training large models',
            body: 'The canonical TP split. Read once, then read it again next to the vLLM TP impl.',
            verify: 'Notes: how TP splits attention vs MLP; which all-reduce sits where',
            hours: '2h',
            resources: [R.megatron_tp, R.weng_train_large],
          },
          {
            id: 'n-w9-r3',
            track: 'read',
            title: 'NCCL docs — collectives overview',
            body: 'all-reduce, all-gather, ring vs tree. Bandwidth-vs-latency tradeoff at the topology level.',
            verify: 'Notes: when ring beats tree and vice versa',
            hours: '1h',
            resources: [R.nccl_docs],
          },
          {
            id: 'n-w9-b1',
            track: 'build',
            title: 'Pick: replica-serving OR 2-GPU TP. Commit Monday.',
            body:
              'Replica-serving = process-level replicas behind a router (works on 1 GPU; demonstrates dispatch). 2-GPU TP = the real thing (requires 2 GPUs; demonstrates collective math).',
            verify: 'dist-inference/docs/w9-decision.md committed Monday EOD',
            hours: '1h',
          },
          {
            id: 'n-w9-b2',
            track: 'build',
            title: 'Replica track — router + N workers + queue',
            body:
              'N mini-vllm worker processes. Front router (FastAPI). Consistent-hash by request id for cache locality. Per-worker queue with backpressure. Health checks. Graceful drain.',
            verify: 'At N=4 workers, aggregate throughput ≥ 3.5× single worker on a mixed workload; failover when one worker is killed',
            hours: '6h',
          },
          {
            id: 'n-w9-b3',
            track: 'build',
            title: 'TP track — 2-GPU column-parallel MLP + row-parallel output',
            body:
              'On a small model (Llama-3.2-1B or your own toy 100M). Use torch.distributed with NCCL. Implement the column+row split for one MLP block. Sanity-check against single-GPU.',
            verify: 'Output matches single-GPU within 1e-3 rtol; per-token latency improves vs single-GPU on the same model',
            hours: '7h',
            resources: [R.megatron_tp, R.nccl_docs],
          },
          {
            id: 'n-w9-b4',
            track: 'build',
            title: 'Scaling chart',
            body:
              'Throughput vs replicas (or vs TP degree). Linear scaling is the asymptote you compare against. Annotate the gap and explain it (HBM, interconnect, kernel-launch overhead, scheduler contention).',
            verify: 'Chart in dist-inference/BENCHMARKS.md with annotated gap explanation',
            hours: '2h',
          },
          {
            id: 'n-w9-a1',
            track: 'apply',
            title: 'dist-inference README — the scaling story',
            body: 'Lead with the chart. Below it, two paragraphs: what scales, what does not, why.',
            verify: 'README pushed; chart embedded',
            hours: '1h',
          },
          {
            id: 'n-w9-a2',
            track: 'apply',
            title: 'Outreach round 3 — follow up + new DMs',
            body: 'Follow up the W4/W6 outreach (silent contacts get one nudge). Send 5 new DMs to dist-systems / inference leads at target companies.',
            verify: '5 follow-ups + 5 new DMs sent; replies tracked',
            hours: '1.5h',
          },
          {
            id: 'n-w9-p1',
            track: 'prep',
            title: 'System-design page 4 — "Design Distributed Batch Inference"',
            body: 'Constraints (1B docs, 1hr SLA, GPU pool with mixed sizes). Sharding + scheduling + spot-instance resilience.',
            verify: 'Page filled; rehearsed in 25 min',
            hours: '2.5h',
          },
          {
            id: 'n-w9-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.pope_efficient, R.megatron_tp, R.weng_train_large, R.nccl_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W10 — OSS Contribution
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-10',
    title: 'Phase 10 — OSS Contribution',
    blurb: 'Land one merged PR in a real serving project. Small + landed > big + stale.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'one merged PR in vLLM / SGLang / TGI / llama.cpp — or a PR with an active maintainer review',
    context:
      'A PR you can link in a cover letter is worth more than every line of mini-vllm. The realistic bar at W10 is "merged or under review" — not "merged in the first 48 hours." Pick a ticket with a clear scope; do not invent your own feature.',
    weeks: [
      {
        number: 10,
        title: 'Ship one OSS PR',
        goal:
          'One PR open in a serving repo with clean tests, clear description, maintainer-friendly diff. Doc / test / small-bug / small-feature scope. Goal: merged. Acceptable: in active review.',
        tasks: [
          {
            id: 'n-w10-r1',
            track: 'read',
            title: 'Re-read the W3 OSS scouting comment thread',
            body: 'You commented on a vLLM issue at W3. Maintainers may have replied. If the original ticket is dead, pick another from your shortlist.',
            verify: 'Decision in north-portfolio/docs/oss-target.md (umbrella repo): pursuing ticket X (URL), reason',
            hours: '45m',
          },
          {
            id: 'n-w10-r2',
            track: 'read',
            title: 'Repo CONTRIBUTING + dev setup',
            body: 'Read the contributor guide for your chosen repo. Set up dev environment, run tests locally, run their formatter/linter.',
            verify: 'Tests run green on main locally; pre-commit hooks installed',
            hours: '2h',
          },
          {
            id: 'n-w10-b1',
            track: 'build',
            title: 'Implement the change',
            body:
              'Keep diff small. Match existing style. Touch only what you must (read the project\'s CLAUDE.md / contributing if there is one — "surgical changes" matters here). One commit, well-named.',
            verify: 'Diff < 200 lines; only relevant files touched',
            hours: '6h',
          },
          {
            id: 'n-w10-b2',
            track: 'build',
            title: 'Test coverage — add or update a test',
            body: 'Any non-doc PR with no test gets ignored. Add the minimal test that proves your fix or covers your feature.',
            verify: 'New test included; runs green; fails on main without your change',
            hours: '2h',
          },
          {
            id: 'n-w10-b3',
            track: 'build',
            title: 'PR description — the writeup that gets reviewed',
            body:
              'Lead with the user-facing problem in 2 sentences. Then your fix in 2 sentences. Then how to verify. Reference the issue. Be polite about edge cases you skipped.',
            verify: 'PR open; description follows project template; CI green',
            hours: '1.5h',
          },
          {
            id: 'n-w10-a1',
            track: 'apply',
            title: 'Link the PR on LinkedIn + portfolio README',
            body: 'No marketing post. Just the link in your "Recent" section. Recruiters search for this; do not hide it.',
            verify: 'PR URL on LinkedIn featured section + portfolio meta-repo README',
            hours: '30m',
          },
          {
            id: 'n-w10-a2',
            track: 'apply',
            title: 'Applications — 10 more',
            body:
              'Half of total. Now mention "open PR in vLLM" (or whichever) in the cover. Even unmerged, the active-review status counts.',
            verify: '10 applications submitted; total now ≥ 25',
            hours: '3h',
          },
          {
            id: 'n-w10-p1',
            track: 'prep',
            title: 'System-design page 5 — "Design Embeddings Serving at Scale"',
            body: 'Constraints (1B vectors, 10k QPS, p99 < 30ms). Index choice (HNSW [graph-based ANN index] vs IVF [inverted-file cluster index]). Sharding. Hot-key handling.',
            verify: 'Page filled; rehearsed in 25 min',
            hours: '2.5h',
          },
          {
            id: 'n-w10-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums + 1 hard',
            verify: '4 mediums + 1 hard solved',
            hours: '2.5h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.vllm_repo, R.sglang_repo, R.tgi_repo, R.llamacpp_repo],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W11 — Interview Prep + Outreach Surge
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-11',
    title: 'Phase 11 — Interview Loops',
    blurb: 'Three mocks. Five system-design rehearsals. Outreach surge.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-compilers)',
    artifact: '3 mock interviews completed + 5 SD rehearsals + 20 outreach threads active',
    context:
      'The portfolio is mostly built. This week is mechanics: doing the loops, getting blunt feedback, fixing the gaps. The single highest-ROI activity is mock interviews — book them aggressively even if it feels uncomfortable.',
    weeks: [
      {
        number: 11,
        title: 'Loops in, feedback in',
        goal:
          'Three completed mock interviews (one ML systems, one DSA, one behavioral). All five SD pages presented out loud. Twenty active outreach threads.',
        tasks: [
          {
            id: 'n-w11-r1',
            track: 'read',
            title: 'Huyen — ML Interviews chapter on ML systems',
            body: 'The decision-tree for SD questions in ML/AI roles. Skim, internalize the framing.',
            verify: 'Notes: the five SD components Huyen always asks about (data, model, infra, eval, monitoring)',
            hours: '2h',
            resources: [R.huyen_ml_interview],
          },
          {
            id: 'n-w11-r2',
            track: 'read',
            title: 'Public writeups — Anthropic / Together / OpenAI inference interview accounts',
            body: 'Levels.fyi, Glassdoor, Reddit r/MachineLearning interview threads. Note common questions.',
            verify: 'north-portfolio/docs/interview-questions.md with 10 likely questions per target company tier',
            hours: '2h',
          },
          {
            id: 'n-w11-b1',
            track: 'build',
            title: 'Mock 1 — ML systems (the booked W8 slot)',
            body: 'Lead with one of your SD pages. Take notes during. Right after, write a postmortem.',
            verify: 'Mock completed; north-portfolio/docs/mock-1.md postmortem committed within 24h',
            hours: '2h',
          },
          {
            id: 'n-w11-b2',
            track: 'build',
            title: 'Mock 2 — DSA (Pramp or interviewing.io)',
            body: 'One medium + one hard. 60 min total. Get feedback on communication, not just correctness.',
            verify: 'Mock completed; north-portfolio/docs/mock-2.md postmortem committed',
            hours: '2h',
          },
          {
            id: 'n-w11-b3',
            track: 'build',
            title: 'Mock 3 — behavioral with a peer',
            body: 'Six STAR stories (from W5). Have the peer interrupt with follow-ups. Time each story (< 90s).',
            verify: 'Mock completed; north-portfolio/docs/mock-3.md postmortem committed',
            hours: '1.5h',
          },
          {
            id: 'n-w11-a1',
            track: 'apply',
            title: 'Outreach surge — push to 20 active threads',
            body:
              'You should already have 15+ from W4/W6/W9. Add 5 more, then follow up everyone who has not replied. Recruiter cold-outreach: also acceptable now that portfolio is dense.',
            verify: 'north-portfolio/docs/outreach.md shows 20 active threads (sent ≤ 14 days ago)',
            hours: '3h',
          },
          {
            id: 'n-w11-a2',
            track: 'apply',
            title: 'Applications — 10 more (total ≥ 35)',
            body: 'Hit your hiring funnel hard. Application math is brutal — assume 2-5% response rate, 25% of replies → screen, 25% of screens → onsite.',
            verify: '10 applications submitted; cumulative ≥ 35',
            hours: '3h',
          },
          {
            id: 'n-w11-p1',
            track: 'prep',
            title: 'Rehearse all 5 SD pages out loud, on camera',
            body:
              'One pass each. Watch the videos at 1.5×. You will hate watching yourself; do it anyway. The crutch words ("um", "kind of", "basically") are what to fix.',
            verify: 'Five videos recorded; one-line self-critique per page committed',
            hours: '3h',
          },
          {
            id: 'n-w11-p2',
            track: 'prep',
            title: 'Compensation prep',
            body:
              'Pull levels.fyi data for target tiers. Write your floor + target + ceiling numbers down. Practice saying the target number out loud — without softening it.',
            verify: 'north-portfolio/docs/comp.md with three numbers per tier; practice rehearsal logged',
            hours: '1.5h',
          },
        ],
        reading: [R.huyen_ml_interview, R.donne_martin, R.neetcode],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W12 — Land + Polish
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-12',
    title: 'Phase 12 — Land',
    blurb: 'Portfolio hub, convert onsites, negotiate. The sprint ends with offers in motion.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'portfolio.<your-domain>.dev hub linking all 4 projects + OSS PR + writeups',
    context:
      'Whether you have offers in hand by Friday or not, the artifact is durable: a single page that shows what you built in 90 days. If you have offers, this week converts the strongest into a signed letter. If you do not, you continue applying — but from a portfolio that 95% of LLM-infra applicants do not have.',
    weeks: [
      {
        number: 12,
        title: 'Portfolio hub + conversion',
        goal:
          'One portfolio hub page live (static site or single GitHub README). All onsites in motion converted. Open offers compared against your W11 comp targets. Sprint retrospective written.',
        tasks: [
          {
            id: 'n-w12-r1',
            track: 'read',
            title: 'Re-read all four project READMEs as a stranger would',
            body: 'Mark anything that requires insider context. Fix the worst three.',
            verify: 'Three concrete README fixes committed across the four projects',
            hours: '2h',
          },
          {
            id: 'n-w12-b1',
            track: 'build',
            title: 'portfolio hub page',
            body:
              'A single page (Astro, Next, plain HTML — does not matter). Top: one-paragraph narrative ("Senior SWE who spent 90 days rebuilding the LLM-serving stack from first principles"). Below: four project cards with one number each (the headline metric). Below that: PR link, writeups, contact.',
            verify: 'Page deployed at a stable URL; mobile-readable; links work',
            hours: '4h',
          },
          {
            id: 'n-w12-b2',
            track: 'build',
            title: 'Resume v2 — projects-led, not roles-led',
            body:
              'Top section: the four projects with metrics. Then OSS PR. Then prior SWE roles (compressed to 5 lines each). Half a page max for pre-AI experience.',
            verify: 'Resume PDF committed; two reviewers gave blunt feedback',
            hours: '3h',
          },
          {
            id: 'n-w12-a1',
            track: 'apply',
            title: 'Convert active onsites',
            body:
              'Any onsite this week: lead with mini-vllm SD (system-design) walkthrough. Use the W11 SD pages. Take notes from each loop; share thank-you within 24h.',
            verify: 'All scheduled onsites attended; thank-yous sent within 24h',
            hours: '8h',
          },
          {
            id: 'n-w12-a2',
            track: 'apply',
            title: 'Final 10 applications',
            body: 'Total cumulative ≥ 45. Sprint ends with the funnel still full so that month 4 conversion is not from cold start.',
            verify: '10 applications submitted',
            hours: '3h',
          },
          {
            id: 'n-w12-a3',
            track: 'apply',
            title: 'Offer comparison + negotiation',
            body:
              'Any offer that lands this week: do not accept on the spot. Sit on it 48h, run the negotiation playbook (counter on comp, not benefits, anchor with target competing offer if you have one).',
            verify: 'north-portfolio/docs/offers.md (umbrella repo) with each offer + the counter you sent + final number',
            hours: 'as needed',
          },
          {
            id: 'n-w12-p1',
            track: 'prep',
            title: 'Sprint retrospective',
            body:
              'What landed (numbers). What did not. What you would do differently if you re-ran W0 with this hindsight. This is the artifact you re-read every six months for the rest of your career.',
            verify: 'north-portfolio/docs/retro.md (umbrella repo) committed; honest, specific, no fluff',
            hours: '2h',
          },
          {
            id: 'n-w12-p2',
            track: 'prep',
            title: 'Next-90-day plan + DSA surge contingency',
            body:
              'You either have an offer (now month 1 of new role: 90-day plan for ramping). Or you do not (now month 4 of search: which assumptions failed, what changes). Either way: a written plan beats default-mode coasting.\n' +
              'DSA NOTE: this sprint deliberately under-prepares DSA (~40 mediums total, ~22h) because Tier A/B target companies value portfolio over Leetcode. IF month 4+ surfaces Tier C interest (frontier-lab phone screens — OpenAI/Anthropic/DeepMind), schedule a 2-week DSA surge BEFORE onsite: ~50 more mediums, ~10 hards, 2 mock interviews/wk. Tier C onsites assume 200-300 problems; cramming after a phone screen is the realistic path.',
            verify: 'north-portfolio/docs/next-90.md (umbrella repo) committed; if applicable, DSA-surge plan documented as a contingency block',
            hours: '1.5h',
          },
          {
            id: 'n-w12-next',
            track: 'prep',
            title: 'Next chapter — point yourself at the RL curriculum',
            body:
              'When you land the inference role (or even just before, while you wait for replies): the next 6-12 months are about becoming the RL-systems engineer who happens to start as an inference engineer. The full curriculum is already written and waiting in the Mosaic training track:\n\n' +
              '  • /training/rl-foundations — MDPs, policy gradient, value/advantage/GAE, trust regions & KL. The math you cannot skip. (~4 weeks)\n' +
              '  • /training/post-training — RLHF pipeline, reward modeling, PPO deep-dive, DPO/GRPO, RLVR. (~6 weeks)\n' +
              '  • /training/rl-systems — rollout engines (vLLM as RL backend — directly extends your mini-vllm!), Ray architectures, verl/OpenRLHF/NeMo-RL internals, async RL & staleness. (~5 weeks)\n' +
              '  • /training/rl-frontier — reasoning models (R1/o1/o3), process reward models, agentic RL, reward hacking + RLAIF + Constitutional AI, self-play/curriculum/code RL. (~5 weeks)\n' +
              '  • Capstones: GRPO trainer with your mini-vllm as rollout engine; reproduce R1-Zero on a 1B model; agentic RL loop end-to-end.\n\n' +
              'Concrete first steps after the W12 retro: (1) read DeepSeek-R1 paper end-to-end; (2) clone verl + OpenRLHF + TRL, build all three; (3) start the rl-foundations track at /training/rl-foundations/mdp-bellman. Once at your new inference role, volunteer for any rollout/post-training work — that is the internal pivot path. Anthropic Fellows applications stay open year-round; re-apply each cycle if first attempt was rejected.\n\n' +
              'This is the durable hook from North into Atlas Year-1. North got you paid; Atlas-RL is where you compound.',
            verify: 'north-portfolio/docs/next-90.md (umbrella repo) has a "RL transition" section linking to the four training-track modules; DeepSeek-R1 paper read; verl + OpenRLHF + TRL cloned and built.',
            hours: '2h',
            resources: [R.mosaic_applied],
          },
        ],
        reading: [R.weng_inference, R.pope_efficient, R.mosaic_applied],
      },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────
// Helpers — local, close over North's PATH (not Atlas's).
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

// ────────────────────────────────────────────────────────────────────────
// Hour-budget helpers — derive load per week from task.hours strings.
// ────────────────────────────────────────────────────────────────────────

export function parseHours(h?: string): number {
  if (!h) return 0
  if (h === 'ongoing' || h === 'as needed') return 0
  if (h.endsWith('m')) return parseFloat(h) / 60
  return parseFloat(h)
}

export function weekHours(week: Week): number {
  return week.tasks.reduce((sum, t) => sum + parseHours(t.hours), 0)
}

// Weeks above this threshold get a DENSE badge in the UI. Derived from the
// audit: W4 ≈26h, W7 ≈26.5h, W8 ≈22.5h, W9 ≈28h (pre-pick-one) all warrant
// the buffer rule. 22h is the empirical cliff above the 20h/wk target.
export const DENSE_WEEK_THRESHOLD_HOURS = 22

export function isDenseWeek(week: Week): boolean {
  return weekHours(week) > DENSE_WEEK_THRESHOLD_HOURS
}

export function maxWeek(): number {
  return Math.max(...PATH.flatMap((p) => p.weeks.map((w) => w.number)))
}

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

export type YearGroup = { year: 0 | 1 | 2 | 3; cadence: 'week' | 'quarter'; weeks: { phase: Phase; week: Week }[] }

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

// ────────────────────────────────────────────────────────────────────────
// Span helpers — global-week index maps onto period numbers 1:1 in North,
// since every phase is single-week cadence. Implemented identically to
// Atlas so the timeline component can stay symmetric.
// ────────────────────────────────────────────────────────────────────────

let _spanMap: Map<number, [number, number]> | null = null

function buildSpanMap(): Map<number, [number, number]> {
  if (_spanMap) return _spanMap
  const m = new Map<number, [number, number]>()
  let cursor = 0
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      const span = phase.cadence === 'week' ? 1 : 13
      m.set(week.number, [cursor, cursor + span - 1])
      cursor += span
    }
  }
  _spanMap = m
  return m
}

export function periodSpan(periodNumber: number): [number, number] {
  return buildSpanMap().get(periodNumber) ?? [0, 0]
}

export function maxGlobalWeek(): number {
  let last = 0
  buildSpanMap().forEach(([, end]) => {
    if (end > last) last = end
  })
  return last
}

export function totalGlobalWeeks(): number {
  return maxGlobalWeek() + 1
}

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

export function periodIndexInPhase(phase: Phase, week: Week): number {
  return phase.weeks.findIndex((w) => w.number === week.number)
}

// ────────────────────────────────────────────────────────────────────────
// Resource library re-export — for external code that wants the catalog.
// ────────────────────────────────────────────────────────────────────────

export const NORTH_RESOURCES: Record<string, Resource> = R
