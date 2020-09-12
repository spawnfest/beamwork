defmodule Spotlight.RequestTimeCollector do
  alias DogSketch.SimpleDog

  def child_spec(_) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, []}
    }
  end

  def start_link() do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def init(nil) do
    :telemetry.attach(__MODULE__, [:phoenix, :endpoint, :stop], &handle_metrics/4, nil)
    {:ok, %{keys: [], value_map: %{}}}
  end

  def handle_metrics([:phoenix, :endpoint, :stop], %{duration: duration}, _metadata, _config) do
    send(
      __MODULE__,
      {:duration, duration, System.monotonic_time(:second), System.time_offset(:second)}
    )
  end

  def handle_info({:duration, duration, mono_time, time_offset}, state) do
    converted_duration_us = System.convert_time_unit(duration, :native, :microsecond)

    new_state =
      case state.keys do
        [^mono_time | _] ->
          %{
            state
            | value_map:
                Map.update!(state.value_map, mono_time, fn {dog_sketch, dt} ->
                  {SimpleDog.insert(dog_sketch, converted_duration_us), dt}
                end)
          }

        keys ->
          sdog =
            SimpleDog.new(error: 0.04)
            |> SimpleDog.insert(converted_duration_us)

          new_state = %{
            keys: [mono_time | keys],
            value_map:
              Map.put(
                state.value_map,
                mono_time,
                {sdog, mono_time + time_offset}
              )
          }

          new_state = Map.put(new_state, :keys, Enum.take(new_state.keys, 50))
          Map.put(new_state, :value_map, Map.take(new_state.value_map, new_state.keys))
      end

    {:noreply, new_state}
  end

  def handle_call(:get_all, _from, state) do
    {:reply, Map.new(state.value_map, fn {_time, {sdog, time}} -> {time, sdog} end), state}
  end

  def get_all do
    GenServer.call(__MODULE__, :get_all)
  end

  def get_merged() do
    {results, _bad_nodes} = :rpc.multicall(__MODULE__, :get_all, [])

    Enum.map(results, fn
      {:badrpc, _reason} -> nil
      result -> result
    end)
    |> Enum.filter(fn x -> x end)
    |> Enum.reduce(%{}, fn result, acc ->
      Map.merge(acc, result, fn _key, s1, s2 ->
        SimpleDog.merge(s1, s2)
      end)
    end)
    |> Enum.sort_by(fn {key, _} -> key end)
  end
end
