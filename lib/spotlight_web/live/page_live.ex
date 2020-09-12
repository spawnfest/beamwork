defmodule SpotlightWeb.PageLive do
  use SpotlightWeb, :live_view
  alias DogSketch.SimpleDog

  @impl true
  def mount(_params, _session, socket) do
    schedule_tick()
    {:ok, assign(socket, quantile_data: formatted_time_series())}
  end

  def handle_info(:tick, socket) do
    schedule_tick()
    {:noreply, assign(socket, :quantile_data, formatted_time_series())}
  end

  defp schedule_tick() do
    Process.send_after(self(), :tick, 1000)
  end

  defp formatted_time_series() do
    data = Spotlight.RequestTimeCollector.get_merged()
    keys = Enum.map(data, fn {ts, _} -> ts end)
    min_ts = Enum.min(keys, fn -> 0 end)
    max_ts = Enum.max(keys, fn -> 0 end)

    keys = Enum.map(min_ts..max_ts, fn x -> x end)

    [
      keys,
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.99) |> ceil()
        val / 1000
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.90) |> ceil()
        val / 1000
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.50) |> ceil()
        val / 1000
      end)
    ]
  end
end
