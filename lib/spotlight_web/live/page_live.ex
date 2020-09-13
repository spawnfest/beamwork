defmodule SpotlightWeb.PageLive do
  use SpotlightWeb, :live_view
  alias DogSketch.SimpleDog

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(quantile_data: formatted_time_series("Linear"))
      |> assign(:pause_action, "Pause")
      |> assign(:refresh_rate, 1000)
      |> assign(:scale, "Linear")

    schedule_tick(socket)

    {:ok, socket}
  end

  @impl true
  def handle_event("controls_changed", %{"rate" => rate_val, "scale" => scale_val}, socket) do
    socket =
      case rate_val do
        "Paused" ->
          assign(socket, :refresh_rate, "Paused")

        str_int ->
          {refresh_rate, _} = Integer.parse(str_int)
          new_socket = assign(socket, :refresh_rate, refresh_rate)
          if socket.assigns.refresh_rate == "Paused", do: schedule_tick(new_socket)
          new_socket
      end

    socket = assign(socket, :scale, scale_val)

    {:noreply, assign(socket, :quantile_data, formatted_time_series(socket.assigns.scale))}
  end

  @impl true
  def handle_info(:tick, socket) do
    unless is_paused?(socket) do
      schedule_tick(socket)
    end

    {:noreply, assign(socket, :quantile_data, formatted_time_series(socket.assigns.scale))}
  end

  defp is_paused?(socket) do
    case socket.assigns.refresh_rate do
      "Paused" -> true
      _ -> false
    end
  end

  defp schedule_tick(socket) do
    Process.send_after(self(), :tick, socket.assigns.refresh_rate)
  end

  defp formatted_time_series("Linear") do
    data = Spotlight.RequestTimeCollector.get_merged()
    keys = Enum.map(data, fn {ts, _} -> ts end)
    min_ts = Enum.min(keys, fn -> 0 end)
    max_ts = Enum.max(keys, fn -> 0 end)

    keys = Enum.map(min_ts..max_ts, fn x -> x end)

    [
      keys,
      Enum.map(keys, fn ts ->
        get_quantile(data, ts, 0.99)
      end),
      Enum.map(keys, fn ts ->
        get_quantile(data, ts, 0.90)
      end),
      Enum.map(keys, fn ts ->
        get_quantile(data, ts, 0.50)
      end),
      Enum.map(keys, fn ts ->
        Map.get(data, ts, SimpleDog.new()) |> SimpleDog.count() |> ceil()
      end)
    ]
  end

  defp get_quantile(data, ts, quantile) do
    Map.get(data, ts, nil)
    |> case do
      nil ->
        nil

      sd ->
        val = SimpleDog.quantile(sd, quantile) |> ceil()
        val / 1000
    end
  end

  defp formatted_time_series("Log2") do
    [keys, p99s, p90s, p50s, counts] = formatted_time_series("Linear")

    [
      keys,
      Enum.map(p99s, &safe_log2/1),
      Enum.map(p90s, &safe_log2/1),
      Enum.map(p50s, &safe_log2/1),
      Enum.map(counts, &safe_log2/1)
    ]
  end

  defp formatted_time_series("Log10") do
    [keys, p99s, p90s, p50s, counts] = formatted_time_series("Linear")

    [
      keys,
      Enum.map(p99s, &safe_log10/1),
      Enum.map(p90s, &safe_log10/1),
      Enum.map(p50s, &safe_log10/1),
      Enum.map(counts, &safe_log10/1)
    ]
  end

  defp safe_log10(x) when x == 0 or is_nil(x), do: nil
  defp safe_log10(x), do: :math.log10(x)
  defp safe_log2(x) when x == 0 or is_nil(x), do: nil
  defp safe_log2(x), do: :math.log2(x)
end
