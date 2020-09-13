defmodule SpotlightWeb.PageLive do
  use SpotlightWeb, :live_view
  alias DogSketch.SimpleDog

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(quantile_data: formatted_time_series("Linear"))
      # |> assign(heatmap_data: formatted_time_series("Heatmap"))
      |> assign(:pause_action, "Pause")
      |> assign(:refresh_rate, 1000)
      |> assign(:scale, "Linear")

    schedule_tick(socket)

    {:ok, socket}
  end

  @impl true
  def handle_event("toggle_pause", _value, socket) do
    new_state =
      if is_paused?(socket) do
        schedule_tick(socket)
        "Pause"
      else
        "Resume"
      end

    {:noreply, assign(socket, :pause_action, new_state)}
  end

  @impl true
  def handle_event("controls_changed", %{"rate" => rate_val, "scale" => scale_val}, socket) do
    {val_int, _} = Integer.parse(rate_val)

    socket =
      socket
      |> assign(:refresh_rate, val_int)
      |> assign(:scale, scale_val)

    {:noreply, socket}
  end

  @impl true
  def handle_info(:tick, socket) do
    unless is_paused?(socket) do
      schedule_tick(socket)
    end

    {:noreply, assign(socket, :quantile_data, formatted_time_series(socket.assigns.scale))}
  end

  defp is_paused?(socket) do
    case socket.assigns.pause_action do
      "Pause" ->
        false

      "Resume" ->
        true
    end
  end

  defp schedule_tick(socket) do
    Process.send_after(self(), :tick, socket.assigns.refresh_rate)
  end

  # defp formatted_time_series("Heatmap") do
  #   data =
  #     Spotlight.RequestTimeCollector.get_merged()
  #     |> Map.new(fn {ts, ds} ->
  #       points =
  #         SimpleDog.to_list(ds)
  #         |> Map.new(fn {val, count} ->
  #           # convert from microseconds to milliseconds
  #           {val / 1000, count}
  #         end)

  #       {ts, points}
  #     end)

  #   min_val = Enum.flat_map(data, fn {_ts, points} -> points end) |> Enum.min()
  #   max_val = Enum.flat_map(data, fn {_ts, points} -> points end) |> Enum.max()

  #   IO.inspect({min_val, max_val}, label: "min_max_val")
  #   keys = Enum.map(data, fn {ts, _} -> ts end)
  #   min_ts = Enum.min(keys, fn -> 0 end)
  #   max_ts = Enum.max(keys, fn -> 0 end)

  #   keys = Enum.map(min_ts..max_ts, fn x -> x end)

  #   [
  #     keys,
  #     Enum.map(keys, fn ts ->
  #       Map.get(data, ts)
  #     end)
  #   ]
  #   |> IO.inspect(label: "heatmap data")
  # end

  defp formatted_time_series("Linear") do
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
      end),
      Enum.map(keys, fn ts ->
        Map.get(data, ts, SimpleDog.new()) |> SimpleDog.count() |> ceil()
      end)
    ]
  end

  defp formatted_time_series("Log2") do
    data = Spotlight.RequestTimeCollector.get_merged()
    keys = Enum.map(data, fn {ts, _} -> ts end)
    min_ts = Enum.min(keys, fn -> 0 end)
    max_ts = Enum.max(keys, fn -> 0 end)

    keys = Enum.map(min_ts..max_ts, fn x -> x end)

    [
      keys,
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.99) |> ceil()
        :math.log2(val / 1000)
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.90) |> ceil()
        :math.log2(val / 1000)
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.50) |> ceil()
        :math.log2(val / 1000)
      end),
      Enum.map(keys, fn ts ->
        Map.get(data, ts, SimpleDog.new()) |> SimpleDog.count() |> ceil()
      end)
    ]
  end

  defp formatted_time_series("Log10") do
    data = Spotlight.RequestTimeCollector.get_merged()
    keys = Enum.map(data, fn {ts, _} -> ts end)
    min_ts = Enum.min(keys, fn -> 0 end)
    max_ts = Enum.max(keys, fn -> 0 end)

    keys = Enum.map(min_ts..max_ts, fn x -> x end)

    [
      keys,
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.99) |> ceil()
        :math.log10(val / 1000)
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.90) |> ceil()
        :math.log10(val / 1000)
      end),
      Enum.map(keys, fn ts ->
        val = Map.get(data, ts, SimpleDog.new()) |> SimpleDog.quantile(0.50) |> ceil()
        :math.log10(val / 1000)
      end),
      Enum.map(keys, fn ts ->
        Map.get(data, ts, SimpleDog.new()) |> SimpleDog.count() |> ceil()
      end)
    ]
  end
end
